import { useActionData } from "@remix-run/react"
import type { ActionArgs} from "@remix-run/node";
import { redirect} from "@remix-run/node"
import {  DUPLICATE_ERROR_CODE, ERROR_MSG, INTENT } from '~/models/posts/const'
import { PostForm } from '~/components/PostForm'
import { getSlugFromTitle, respondWithError } from "~/models/posts/actions.server"
import type { PostsInsert } from "~/models/posts/db.server";
import { postCreate } from "~/models/posts/db.server"
import { z } from "zod";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent !== INTENT.create) {
    throw new Error(`Intent "${intent}" not allowed`)
  }
    
  const userData = {
    title: formData.get('title'),
    text: formData.get('text'),
  }
  
  const Post = z.object({
    title: z.string({
      required_error: ERROR_MSG.empty, 
    }).nonempty(ERROR_MSG.empty),
    text: z.string().optional(),
  })

  let post: PostsInsert;

  try {
    const validatedData = Post.parse(userData);
    const slug = getSlugFromTitle(validatedData.title)
    const timestamp = new Date().toISOString()
    post = { 
      ...validatedData, 
      slug,
      created_at: timestamp,
      updated_at: timestamp, 
    }
  } catch (error) {
    console.error(error)
    return respondWithError(ERROR_MSG.empty, 400)
  }

  const { error: sbError } = await postCreate(post)

  if (sbError?.code === DUPLICATE_ERROR_CODE) {
    console.error(sbError)
    return respondWithError(ERROR_MSG.duplicate, 400)
  }

  if (sbError) {
    console.error(sbError)
    return respondWithError(ERROR_MSG.database, 500)
  }

  return redirect('/posts')
}

export default function NewPost() {
  const res = useActionData<typeof action>()

  return (
    <PostForm
      titleError={res?.error.message}
      method="post" 
      replace
    />
  )
}