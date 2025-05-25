import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DeleteRaceButton from '@/components/features/DeleteRaceButton';
import { Race } from '@/lib/supabase/database.types';

interface PageProps {
  params: { id: string };
}

function formatTimeReduction(seconds: number): string {
  const minutes = seconds / 60;
  return `${minutes} minuter`;
}

export default async function RacePage({ params }: PageProps) {
  const [authResult, resolvedParams] = await Promise.all([
    auth(),
    Promise.resolve(params)
  ]);
  
  const { userId } = authResult;
  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createClient();
  const { data: race, error } = await supabase
    .from('races')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', userId)
    .single();

  if (error || !race) {
    redirect('/dashboard');
  }

  const typedRace = race as Race;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← Tillbaka till dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{typedRace.name}</h1>
          <div className="flex gap-4">
            <Link
              href={`/dashboard/races/${typedRace.id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Redigera tävling
            </Link>
            <Link
              href={`/dashboard/races/${typedRace.id}/timer`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Visa timer
            </Link>
            <DeleteRaceButton userId={userId} raceId={typedRace.id} />
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Tävlingsinformation</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-gray-700">Typ</dt>
                <dd className="font-medium text-gray-900">{typedRace.type === 'backyard' ? 'Backyard' : 'Frontyard'}</dd>
              </div>
              <div>
                <dt className="text-gray-700">Status</dt>
                <dd className="font-medium text-gray-900">{typedRace.status}</dd>
              </div>
              <div>
                <dt className="text-gray-700">Skapad</dt>
                <dd className="font-medium text-gray-900">{new Date(typedRace.created_at).toLocaleDateString('sv-SE')}</dd>
              </div>
              {typedRace.start_time && (
                <div>
                  <dt className="text-gray-700">Planerad starttid</dt>
                  <dd className="font-medium text-gray-900">
                    {new Date(typedRace.start_time).toLocaleString('sv-SE', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Tävlingsinställningar</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-gray-700">Rundlängd</dt>
                <dd className="font-medium text-gray-900">{typedRace.lap_distance} meter</dd>
              </div>
              <div>
                <dt className="text-gray-700">Intervalltid</dt>
                <dd className="font-medium text-gray-900">{formatTimeReduction(typedRace.interval_time)}</dd>
              </div>
              {typedRace.type === 'frontyard' && (
                <div>
                  <dt className="text-gray-700">Tidsreduktion per varv</dt>
                  <dd className="font-medium text-gray-900">{formatTimeReduction(typedRace.lap_reduction)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 