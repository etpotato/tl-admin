import { supabase } from '../utils/supabase.server'

export async function postsGetAll() {
  return await supabase
    .from('posts')
    .select('id,title,slug')
    .order('created_at')
}

export async function postGet(slug: string) {
  return await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single()
}