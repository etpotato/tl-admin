import { Form, useActionData, useTransition } from "@remix-run/react"
import type { ActionArgs} from "@remix-run/node";
import { redirect, json } from "@remix-run/node"
import { postCreate } from "~/models/posts.server"

const INTENT = {
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const

const DUPLICATE_ERROR_CODE = '23505'

const ERROR_MSG = {
  empty: 'Title must be defined',
  duplicate: 'Title already have been used. Must be unique',
  database: 'Database error',
} as const

async function respondWithError(message: string, status: number) {
  return json({ error: { message }}, { status, statusText: message })
}

function processPostFormData(formData: FormData) {
  const title = formData.get('title')?.toString() || ''
  const text = formData.get('text')?.toString() || ''

  const error = !title
  const valid = Boolean(title)
  const post = {
    title,
    text,
    slug: title.trim().toLowerCase().split(' ').join('_'),
  }

  return { valid, error, post }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch(intent) {
    case INTENT.create:
      const { valid, post } = processPostFormData(formData)

      if (!valid) {
        return respondWithError(ERROR_MSG.empty, 400)
      }

      const { error: sbError } = await postCreate(post)

      if (sbError?.code === DUPLICATE_ERROR_CODE) {
        return respondWithError(ERROR_MSG.duplicate, 400)
      }

      if (sbError) {
        return respondWithError(ERROR_MSG.database, 500)
      }

      return redirect('/posts')
    default:
      throw new Error(`no such intent: "${intent}"`)
  }
}

export default function NewPost() {
  const res = useActionData<typeof action>()
  const transition = useTransition()
  const isCreating = 
    transition.submission?.formData.get('intent') === INTENT.create 
    && transition.state !== 'idle'

  return (
    <Form method="post">
      <label >
        Title:
        {res?.error.message === ERROR_MSG.empty ? <em>is required</em> : null}
        {res?.error.message === ERROR_MSG.duplicate ? <em>already have been used, must be unique</em> : null}
        {res?.error.message === ERROR_MSG.database ? <em>database error</em> : null}
        <input type='text' name='title'/>
      </label>
      <label >
        Text:
        <input type='text' name='text'/>
      </label>
      <button type='submit' name='intent' value={INTENT.create} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create'}
      </button>
    </Form>
  )
}