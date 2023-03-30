import { Link, useLoaderData } from "@remix-run/react"
import { postsGetAll } from "~/models/posts/db.server"
import { json } from '@remix-run/node'
import { Outlet } from "@remix-run/react";

const BTN = 'block no-underline py-1 px-2 border-1 border-inherit border-solid rounded text-inherit'

export async function loader() {
  const posts = await postsGetAll()
  return json(posts.data || [])
}

export default function Posts() {
  const posts = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>These are my posts</h1>
      <div className="flex gap-4 mb-4">
        <Link to="/" className={BTN}>Home</Link>
      </div>
      <div className="grid grid-cols-[30%_1fr] gap-8">
        <div>
          <Link to="new" className='block text-green-600 mb-2'>Create post</Link>
          <ol className="m-0 pl-4">{posts.map((post) => (
            <li key={post.id}>
              <Link to={post.slug}>
                {post.title}
              </Link>
            </li>
          ))}
          </ol>
        </div>
        <div >
          <Outlet/>
        </div>
      </div>
    </main>
  )
}