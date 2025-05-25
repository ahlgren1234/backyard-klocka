import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function RaceResultsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createClient();
  const { data: race, error } = await supabase
    .from('races')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !race) {
    redirect('/dashboard');
  }

  const startTime = race.start_time ? new Date(race.start_time) : null;
  const endTime = new Date();
  const duration = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
  const totalDistance = race.lap_distance * (race.current_lap || 0);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters} meter`;
    }
    const kilometers = (meters / 1000).toFixed(2);
    return `${kilometers} km`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{race.name} - Resultat</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Tävlingsinformation</h2>
              <p className="text-gray-600">Typ: {race.type === 'backyard' ? 'Backyard Ultra' : 'Frontyard'}</p>
              <p className="text-gray-600">Status: Avslutad</p>
              <p className="text-gray-600">Starttid: {startTime?.toLocaleString('sv-SE')}</p>
              <p className="text-gray-600">Sluttid: {endTime.toLocaleString('sv-SE')}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Resultat</h2>
              <p className="text-gray-600">Antal varv: {race.current_lap || 0}</p>
              <p className="text-gray-600">Total distans: {formatDistance(totalDistance)}</p>
              <p className="text-gray-600">Total tid: {formatDuration(duration)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link 
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tillbaka till dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 