import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs} from '@remix-run/node';
import { json } from '@remix-run/node'
import { postGet } from "~/models/posts.server";
import invariant from 'invariant'


export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, 'string', 'Slug must be a string')
  const post = await postGet(params.slug)
  return json(post.data)
}

export default function Post() {
  const post = useLoaderData<typeof loader>()

  if (!post) {
    return <p>Post not found :koala:</p>
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.text}</p>
      <p>Created: {new Date(post.created_at).toLocaleString()}</p>
    </article>
  ) 
}