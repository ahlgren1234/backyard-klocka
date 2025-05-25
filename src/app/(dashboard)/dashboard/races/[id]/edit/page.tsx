import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Race } from '@/lib/supabase/database.types';

interface PageProps {
  params: { id: string };
}

export default async function EditRacePage({ params }: PageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createClient();
  const { data: race, error } = await supabase
    .from('races')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (error || !race) {
    redirect('/dashboard');
  }

  const typedRace = race as Race;

  async function updateRace(formData: FormData) {
    'use server';
    
    const userId = formData.get('userId') as string;
    const raceId = formData.get('raceId') as string;
    
    if (!userId || !raceId) {
      redirect('/sign-in');
    }
    
    const minutes = parseInt(formData.get('interval_time') as string);
    const seconds = minutes * 60;
    
    const type = formData.get('type') as 'backyard' | 'frontyard';
    const timeReductionMinutes = type === 'frontyard' ? parseInt(formData.get('lap_reduction') as string) : 0;
    const timeReductionSeconds = timeReductionMinutes * 60;

    const startTime = formData.get('start_time') as string;
    let startTimeISO = null;

    if (startTime) {
      const localDate = new Date(startTime);
      startTimeISO = localDate.toISOString();
    }
    
    const supabase = await createClient();
    const { error } = await supabase
      .from('races')
      .update({
        name: formData.get('name') as string,
        type: type,
        lap_distance: parseInt(formData.get('lap_distance') as string),
        interval_time: seconds,
        lap_reduction: timeReductionSeconds,
        start_time: startTimeISO,
      })
      .eq('id', raceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating race:', error);
      return;
    }

    redirect(`/dashboard/races/${raceId}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/dashboard/races/${typedRace.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← Tillbaka till tävling
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Redigera tävling</h1>

        <form action={updateRace} className="space-y-6">
          <input type="hidden" name="raceId" value={typedRace.id} />
          <input type="hidden" name="userId" value={userId} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tävlingsnamn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={typedRace.name}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tävlingstyp
            </label>
            <select
              id="type"
              name="type"
              defaultValue={typedRace.type}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="backyard">Backyard Ultra</option>
              <option value="frontyard">Frontyard Ultra</option>
            </select>
          </div>

          <div>
            <label htmlFor="lap_distance" className="block text-sm font-medium text-gray-700">
              Rundlängd (meter)
            </label>
            <input
              type="number"
              id="lap_distance"
              name="lap_distance"
              min="1"
              defaultValue={typedRace.lap_distance}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="interval_time" className="block text-sm font-medium text-gray-700">
              Intervalltid (minuter)
            </label>
            <input
              type="number"
              id="interval_time"
              name="interval_time"
              min="1"
              defaultValue={typedRace.interval_time / 60}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
              Planerad starttid
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              defaultValue={typedRace.start_time ? new Date(typedRace.start_time).toISOString().slice(0, 16) : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          <div id="frontyard-fields" className="space-y-6" style={{ display: typedRace.type === 'frontyard' ? 'block' : 'none' }}>
            <div>
              <label htmlFor="lap_reduction" className="block text-sm font-medium text-gray-700">
                Tidsreduktion per varv (minuter)
              </label>
              <input
                type="number"
                id="lap_reduction"
                name="lap_reduction"
                min="0"
                defaultValue={typedRace.lap_reduction / 60}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Spara ändringar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 