import { Link } from "@remix-run/react";

const BTN = 'block no-underline py-1 px-4 border-1 border-inherit border-solid rounded text-inherit'

export default function Index() {
  return (
    <main>
      <h1>index route</h1>
      <div className="flex gap-4 mb-4">
        <Link to="/posts" className={BTN}>Posts</Link>
        <Link to="/signup" className={BTN}>Signup</Link>
        <Link to="/login" className={BTN}>Login</Link>
      </div>
    </main>
  );
}
