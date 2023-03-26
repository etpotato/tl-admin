import { json } from "@remix-run/node";

export async function respondWithError(message: string, status: number) {
  return json({ error: { message }}, { status, statusText: message })
}

export function getSlugFromTitle(title: string) {
  return (title.match(/([\w\d])+/g) || []).join('_')
}