import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Race } from '@/lib/supabase/database.types';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createClient();
  const { data: races, error } = await supabase
    .from('races')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching races:', error);
  }

  const typedRaces = races as Race[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mina tävlingar</h1>
        <Link 
          href="/dashboard/races/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Skapa ny tävling
        </Link>
      </div>

      {typedRaces && typedRaces.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {typedRaces.map((race) => (
            <div 
              key={race.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900">{race.name}</h2>
              <div className="text-gray-700 mb-4">
                <p>Typ: {race.type === 'backyard' ? 'Backyard' : 'Frontyard'}</p>
                <p>Status: {race.status}</p>
                <p>Skapad: {new Date(race.created_at).toLocaleDateString('sv-SE')}</p>
              </div>
              <Link 
                href={`/dashboard/races/${race.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Visa detaljer →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-700 mb-4">Du har inte skapat några tävlingar än.</p>
          <Link 
            href="/dashboard/races/new" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Skapa din första tävling
          </Link>
        </div>
      )}
    </div>
  );
} 