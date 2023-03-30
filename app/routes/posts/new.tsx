import { useActionData } from "@remix-run/react"
import type { ActionArgs} from "@remix-run/node";
import { redirect} from "@remix-run/node"
import { ERROR_MSG, INTENT } from '~/models/posts/const'
import { DUPLICATE_ERROR_CODE } from '~/const'
import { PostForm } from '~/components/PostForm'
import { getSlugFromTitle, respondWithError } from "~/models/posts/actions.server"
import type { PostsInsert } from "~/models/posts/db.server";
import { postCreate } from "~/models/posts/db.server"
import { z } from "zod";

const PostSchema = z.object({
  title: z.string({
    required_error: ERROR_MSG.empty, 
  }).nonempty(ERROR_MSG.empty),
  text: z.string().optional(),
})

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const userData = Object.fromEntries(formData.entries())

  if (userData.intent !== INTENT.create) {
    throw new Error(`Intent "${userData.intent}" not allowed`)
  }

  let post: PostsInsert;

  try {
    const validatedData = PostSchema.parse(userData);
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