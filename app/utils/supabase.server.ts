import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase_types.server'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY

if (!url || !key) {
  throw new Error('Supabse credentials is not provided!')
}

export const supabase = createClient<Database>(url, key)