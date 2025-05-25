'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import RaceDisplay from '@/components/features/RaceDisplay';
import { Race } from '@/lib/supabase/database.types';

interface PageProps {
  params: { id: string };
}

export default function RaceTimerPage({ params }: PageProps) {
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    async function fetchRace() {
      if (!isLoaded || !userId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.error('Failed to fetch race:', error);
        redirect('/dashboard');
      }

      setRace(data as Race);
      setLoading(false);
    }

    fetchRace();
  }, [params.id, userId, isLoaded]);

  const handleStatusChange = async (newStatus: 'not_started' | 'in_progress' | 'completed' | 'active' | 'draft') => {
    console.log('handleStatusChange called with status:', newStatus);
    if (!race) return;
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('races')
      .update({ status: newStatus })
      .eq('id', race.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to update race status:', error);
    } else if (data) {
      console.log('Updating race state in RaceTimerPage with status:', newStatus);
      setRace(prevRace => prevRace ? { ...prevRace, status: newStatus } : null);
    }
  };

  if (loading || !isLoaded) {
    return <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">Laddar tävling...</div>;
  }

  if (!userId) {
    return null;
  }

  if (!race) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className="absolute top-4 left-4 z-10">
        <Link 
          href={`/dashboard/races/${race.id}`}
          className="text-white hover:text-gray-300 font-medium"
        >
          ← Tillbaka till tävling
        </Link>
      </div>
      <RaceDisplay 
        race={race} 
        onStatusChange={handleStatusChange}
      />
    </div>
  );
} 