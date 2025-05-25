'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function deleteRace(formData: FormData) {
  const userId = formData.get('userId') as string;
  const raceId = formData.get('raceId') as string;
  
  if (!userId || !raceId) {
    return;
  }
  
  const supabase = await createClient();
  const { error } = await supabase
    .from('races')
    .delete()
    .eq('id', raceId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting race:', error);
    return;
  }

  redirect('/dashboard');
} 