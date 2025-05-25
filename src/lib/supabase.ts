import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Typer för våra databasmodeller
export type Race = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  type: 'backyard' | 'frontyard';
  lap_distance: number; // i meter
  interval_time: number; // i sekunder
  lap_reduction?: number; // i sekunder, endast för frontyard
  start_time?: string;
  status: 'draft' | 'active' | 'completed';
};

export type Lap = {
  id: string;
  created_at: string;
  race_id: string;
  lap_number: number;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed';
}; 