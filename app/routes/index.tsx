import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <h1>Timeline admin</h1>
      <div className="flex gap-4 mb-4">
        <Link to="/posts">Posts</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </main>
  );
}
