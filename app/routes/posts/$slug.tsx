import { useLoaderData } from "@remix-run/react"
import type { ActionArgs, LoaderArgs} from '@remix-run/node';
import { redirect} from '@remix-run/node';
import { json } from '@remix-run/node'
import type { PostsInsert, Post} from "~/models/posts/db.server";
import { postDelete } from "~/models/posts/db.server";
import { postGet, postUpdate } from "~/models/posts/db.server";
import { z } from 'zod'
import { getParsedDate } from "~/utils/ui";
import { PostForm } from "~/components/PostForm";
import { DUPLICATE_ERROR_CODE, ERROR_MSG, INTENT } from "~/models/posts/const";
import { getSlugFromTitle, respondWithError } from "~/models/posts/actions.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('intent')

  if (intent === INTENT.update) {
    const userData = {
      title: formData.get('title'),
      text: formData.get('text'),
      id: formData.get('postId'),
    }

    const PostSchema = z.object({
      title: z.string({
        required_error: ERROR_MSG.empty, 
      }).nonempty(ERROR_MSG.empty),
      text: z.string().optional(),
      id: z.string(),
    })

    let post: PostsInsert
    let id: Post['id']

    try {
      const validatedData = PostSchema.parse(userData);
      id = validatedData.id
      const slug = getSlugFromTitle(validatedData.title)
      post = {
        slug,
        title: validatedData.title,
        text: validatedData.text,
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error(error)
      return respondWithError(ERROR_MSG.empty, 400)
    }

    const { error: sbError } = await postUpdate({ id, post })

    if (sbError?.code === DUPLICATE_ERROR_CODE) {
      console.error(sbError)
      return respondWithError(ERROR_MSG.duplicate, 400)
    }

    if (sbError) {
      console.error(sbError)
      return respondWithError(ERROR_MSG.database, 500)
    }

    return redirect(`/posts/${post.slug}`)
  }

  if (intent === INTENT.delete) {
    const userDataId = formData.get('postId')
    let id: Post['id']

    try {
      id = z.string().parse(userDataId)
    } catch (error) {
      console.error(error)
      return respondWithError('Post id is required', 400)
    }

    const { error } = await postDelete(id)

    if (error) {
      console.error(error)
      return respondWithError(ERROR_MSG.database, 500)
    }

    return redirect('/posts')
  }

  throw new Error(`Intent "${intent}" not allowed`)
}

export async function loader({ params }: LoaderArgs) {
  const slug = z.string().parse(params.slug)
  const post = await postGet(slug)
  return json(post.data)
}

export default function PostArticle() {
  const post = useLoaderData<typeof loader>()

  if (!post) {
    return <p>Post not found</p>
  }

  return (
    <>
      <article>
        <h2>{post.title}</h2>
        <p>{post.text}</p>
        <p>Created: {getParsedDate(post.created_at)}</p>
        { post.updated_at === post.created_at 
          ? null 
          : <p>Updated: {getParsedDate(post.updated_at)}</p>
        }
      </article>
      <PostForm
        key={post.slug}
        defaultTitle={post.title}
        defaultText={post.text}
        postId={post.id}
        method="put"
        replace
      />
    </>
  ) 
}