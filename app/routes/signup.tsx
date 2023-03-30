import type { ActionArgs} from "@remix-run/node";
import { redirect} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { z } from "zod";
import { userCreate } from "~/models/users/db.server";
import { getPasswordHash } from "~/utils/auth.server";
import { ValidationError } from "~/components/ValidationError";
import { DUPLICATE_ERROR_CODE } from "~/const";

type ActionData = {
  error: {
    username?: string[]
    password?: string[]
    secret?: string[]
    db?: string[]
  }
}

function getNewUserShema(secret: string) {
  return z.object({
    username: z.string().nonempty('login is required'),
    password: z.string().min(8, 'password should be at least 8 chars long'),
    secret: z.literal(secret, { 
      errorMap() {
        return { message: 'invite code is required' }
      }
    }
    ),
  })
}

export async function action({ request }: ActionArgs) {
  const NewUserSchema = getNewUserShema(process.env.SIGNUP_SECRET || 'random')
  const formData = await request.formData()
  const userData = Object.fromEntries(formData.entries())

  const parsedNewUser = NewUserSchema.safeParse(userData)

  if (!parsedNewUser.success) {
    console.log('formatted', parsedNewUser.error.flatten())
    return json({ error: parsedNewUser.error.formErrors.fieldErrors }, { status: 400, statusText: 'Validation error' })
  }

  const passwordHash = await getPasswordHash(parsedNewUser.data.password)
  
  const { error } = await userCreate({
    name: parsedNewUser.data.username,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.log(error)
    const resError = error.code === DUPLICATE_ERROR_CODE
      ? { username: ['the name is already taken'] }
      : { db: ['create user error'] }
    return json({ error: resError }, { status: 500, statusText: 'create user error' })
  }

  return redirect('/')
}

export default function Signup() {
  const transition = useTransition()
  const isLoading = Boolean(transition.submission?.formData.get('signup') && transition.state)
  const actionData = useActionData<ActionData>()

  return (
    <>
      <Link to='/'>Home</Link>
      <h1>Signup</h1>
      <Form method="post">
        <ValidationError msg={actionData?.error ? 'Invalid input data' : ''} />
        <label className="block mb-4">
          <span className="block mb-2">
            Login: <ValidationError msg={actionData?.error?.username?.[0]} />
          </span>
          <input type="text" name="username" autoComplete="off" className="block"/>
        </label>
        <label className="block mb-4">
          <span className="block mb-2">
            Password: <ValidationError msg={actionData?.error?.password?.[0]} />
          </span>
          <input type="password" name="password" autoComplete="off" className="block"/>
        </label>
        <label className="block mb-4">
          <span className="block mb-2">
            Invite code: <ValidationError msg={actionData?.error?.secret?.[0]} />
          </span>
          <input type="text" name="secret" autoComplete="off" className="block"/>
        </label>
        <button disabled={isLoading} type="submit" name="signup" value="true">
          {isLoading ? 'Loading...' : 'Signup'}
        </button>
      </Form>
    </>
  )
}
