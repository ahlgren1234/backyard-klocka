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
      races: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          type: 'backyard' | 'frontyard'
          lap_distance: number
          interval_time: number
          lap_reduction: number
          start_time: string | null
          status: 'draft' | 'active' | 'completed'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          type: 'backyard' | 'frontyard'
          lap_distance: number
          interval_time: number
          lap_reduction: number
          start_time?: string | null
          status?: 'draft' | 'active' | 'completed'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          type?: 'backyard' | 'frontyard'
          lap_distance?: number
          interval_time?: number
          lap_reduction?: number
          start_time?: string | null
          status?: 'draft' | 'active' | 'completed'
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

export type Race = {
  id: string;
  name: string;
  type: 'backyard' | 'frontyard';
  interval_time: number;
  lap_reduction: number;
  lap_distance: number;
  current_lap: number;
  status: 'draft' | 'not_started' | 'active' | 'in_progress' | 'completed';
  start_time: string | null;
  created_at: string;
  user_id: string;
}; 