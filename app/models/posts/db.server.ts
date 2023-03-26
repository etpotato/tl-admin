import { supabase } from '~/utils/supabase.server'
import type { Database } from '~/utils/supabase_types.server'

type Posts = Database['public']['Tables']['posts']
export type Post = Posts['Row']
export type PostsInsert = Posts['Insert']

export async function postsGetAll() {
  return await supabase
    .from('posts')
    .select('id,title,slug')
    .order('created_at')
}

export async function postGet(slug: Post['slug']) {
  return await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()
}

export async function postCreate(post: PostsInsert) {
  return await supabase
    .from('posts')
    .insert(post)
    .select('slug')
    .single()
}

export async function postUpdate({ id, post }: { id: Post['id']; post: Posts['Update'] }) {
  return await supabase
    .from('posts')
    .update({...post})
    .eq('id', id)
}