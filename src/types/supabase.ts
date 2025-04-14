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
      moves: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      favorite_rounds: {
        Row: {
          id: string
          user_id: string | null
          name: string
          combinations: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          combinations: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          combinations?: Json
          created_at?: string
        }
      }
      saved_workouts: {
        Row: {
          id: string
          user_id: string | null
          name: string
          rounds: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          rounds: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          rounds?: Json
          created_at?: string
        }
      }
    }
  }
}