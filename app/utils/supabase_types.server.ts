export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          author_id: string
          created_at: string
          id: string
          slug: string
          text: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          slug: string
          text?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          slug?: string
          text?: string | null
          title?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          created_at: string
          id: string
          name: string
          password_hash: string
          role: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          password_hash: string
          role?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          password_hash?: string
          role?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
