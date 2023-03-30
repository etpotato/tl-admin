import { supabase } from '~/utils/supabase.server'
import type { Database } from '~/utils/supabase_types.server'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']

export async function userCreate(user: UserInsert) {
  return await supabase
    .from('users')
    .insert(user)
    .select('id')
    .single()
}

export async function userGet(name: User['name']) {
  return await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .single()
}