import type { ActionArgs } from "@remix-run/node";
import { redirect} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { z } from "zod";
import { ValidationError } from "~/components/ValidationError";
import { userGet } from "~/models/users/db.server";
import { comparePassword } from "~/utils/auth.server";

type ActionData = {
  error: {
    username?: string[]
    password?: string[]
    db?: string[]
  }
}

const UserSchema =  z.object({
  username: z.string().nonempty('Login is required'),
  password: z.string().nonempty('Password is required'),
})

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const userData = Object.fromEntries(formData.entries())

  const parsedUser = UserSchema.safeParse(userData)

  if (!parsedUser.success) {
    console.log('login validation error', parsedUser.error.formErrors.fieldErrors)
    return json({ error: parsedUser.error.formErrors.fieldErrors }, { status: 400, statusText: 'Validation error' })
  }
 
  const { data: userFromDb, error } = await userGet(parsedUser.data.username)

  if (error) {
    console.log('login user get error', error)
    return json({ error: { db: ['Invalid login or password'] } }, { status: 400, statusText: 'Validation error' })
  }

  const passwordMatches = await comparePassword({ 
    password: parsedUser.data.password,
    hash: userFromDb.password_hash
  })

  if (!passwordMatches) {
    console.log('login password mismatch')
    return json({ error: { db: ['Invalid login or password'] } }, { status: 400, statusText: 'Validation error' })
  }

  return redirect('/')
}

export default function Login() {
  const transition = useTransition()
  const isLoading = Boolean(transition.submission?.formData.get('login') && transition.state)
  const actionData = useActionData<ActionData>()

  return (
    <>
      <Link to='/'>Home</Link>
      <h1>Login</h1>
      <ValidationError msg={actionData?.error ? 'Invalid login or password' : ''} />
      <Form method="post">
        <label className="block mb-4">
          <span className="block mb-2">
            Login: <ValidationError msg={actionData?.error?.username?.[0]} />
          </span>
          <input type="text" name="username" autoComplete="username" className="block"/>
        </label>
        <label className="block mb-4">
          <span className="block mb-2">
            Password: <ValidationError msg={actionData?.error?.password?.[0]} />
          </span>
          <input type="password" name="password" autoComplete="current-password" className="block"/>
        </label>
        <button disabled={isLoading} type="submit" name="login" value="true">
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </Form>
    </>
  )
}