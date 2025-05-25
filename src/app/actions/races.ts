'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

export async function updateRace(formData: FormData) {
  const userId = formData.get('userId') as string;
  const raceId = formData.get('raceId') as string;
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'backyard' | 'frontyard';
  const lapDistance = parseInt(formData.get('lap_distance') as string);
  const intervalTimeMinutes = parseInt(formData.get('interval_time') as string);
  const lapReductionMinutes = parseInt(formData.get('lap_reduction') as string);
  const startTime = formData.get('start_time') as string;

  if (!userId || !raceId) {
    redirect('/sign-in');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('races')
    .update({
      name,
      type,
      lap_distance: lapDistance,
      interval_time: intervalTimeMinutes * 60,
      lap_reduction: lapReductionMinutes * 60,
      start_time: startTime || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', raceId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating race:', error);
    return;
  }

  redirect(`/dashboard/races/${raceId}`);
}

export async function deleteRace(formData: FormData) {
  const userId = formData.get('userId') as string;
  const raceId = formData.get('raceId') as string;
  
  if (!userId || !raceId) {
    console.error('Missing userId or raceId for deleteRace');
    redirect('/dashboard');
  }
  
  const supabase = await createClient();
  const { error } = await supabase
    .from('races')
    .delete()
    .eq('id', raceId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting race:', error);
  }

  console.log(`Race ${raceId} deleted successfully by user ${userId}`);
  redirect('/dashboard');
}

export async function createRace(formData: FormData) {
  'use server';
  
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const minutes = parseInt(formData.get('interval_time') as string);
  const seconds = minutes * 60;
  
  const type = formData.get('type') as 'backyard' | 'frontyard';
  
  const timeReductionMinutes = type === 'frontyard' ? parseInt(formData.get('lap_reduction') as string) : 0;
  const timeReductionSeconds = timeReductionMinutes * 60;
  
  const startTime = formData.get('start_time') as string;
  const startTimeISO = startTime ? new Date(startTime).toISOString() : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from('races')
    .insert({
      user_id: userId,
      name: formData.get('name') as string,
      type: type,
      lap_distance: parseInt(formData.get('lap_distance') as string),
      interval_time: seconds,
      lap_reduction: timeReductionSeconds,
      status: 'draft',
      start_time: startTimeISO,
    });

  if (error) {
    console.error('Error creating race:', error);
  }

  console.log('Race created successfully');
  redirect('/dashboard');
} 