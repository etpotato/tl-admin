import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="container mx-auto">
      <h1>index route</h1>
      <Link to="/posts">Posts</Link>
    </main>
  );
}
