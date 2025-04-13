export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string | null
          first_name: string | null
          last_name: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
        }
      }
      user_interests: {
        Row: {
          id: string
          created_at: string
          user_id: string
          interest: string
          source: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          interest: string
          source?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          interest?: string
          source?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          user_id: string
          content: string
          is_bot: boolean
          message_type: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          content: string
          is_bot: boolean
          message_type?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          content?: string
          is_bot?: boolean
          message_type?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
} 