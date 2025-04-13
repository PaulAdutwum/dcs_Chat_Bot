export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      interests: {
        Row: {
          id: string
          user_id: string
          category: string
          interest: string
          strength: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          interest: string
          strength: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          interest?: string
          strength?: number
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          role?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string | null
          major: string | null
          year: number | null
          interests: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          major?: string | null
          year?: number | null
          interests?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          major?: string | null
          year?: number | null
          interests?: Json | null
          created_at?: string
          updated_at?: string
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
  }
} 