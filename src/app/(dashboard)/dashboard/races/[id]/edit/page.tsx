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
    const timeReductionMinutes = type === 'frontyard' ? parseInt(formData.get('time_reduction') as string) : 0;
    const timeReductionSeconds = timeReductionMinutes * 60;
    
    const supabase = await createClient();
    const { error } = await supabase
      .from('races')
      .update({
        name: formData.get('name') as string,
        type: type,
        lap_distance: parseInt(formData.get('lap_distance') as string),
        interval_time: seconds,
        lap_reduction: timeReductionSeconds,
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
          href={`/dashboard/races/${params.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← Tillbaka till tävling
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Redigera tävling</h1>

        <form action={updateRace} className="space-y-6">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="raceId" value={params.id} />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tävlingsnamn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={typedRace.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tävlingstyp
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue={typedRace.type}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="backyard">Backyard</option>
              <option value="frontyard">Frontyard</option>
            </select>
          </div>

          <div>
            <label htmlFor="lap_distance" className="block text-sm font-medium text-gray-700 mb-1">
              Rundlängd (meter)
            </label>
            <input
              type="number"
              id="lap_distance"
              name="lap_distance"
              required
              min="1"
              defaultValue={typedRace.lap_distance}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="interval_time" className="block text-sm font-medium text-gray-700 mb-1">
              Intervalltid (minuter)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="interval_time"
                name="interval_time"
                required
                min="1"
                defaultValue={Math.floor(typedRace.interval_time / 60)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
              <span className="text-sm text-gray-500" id="interval-time-display"></span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Ange tiden i minuter (t.ex. 5 för 5 minuter)
            </p>
          </div>

          {typedRace.type === 'frontyard' && (
            <div>
              <label htmlFor="time_reduction" className="block text-sm font-medium text-gray-700 mb-1">
                Tidsreduktion per varv (minuter)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  id="time_reduction"
                  name="time_reduction"
                  min="1"
                  defaultValue={Math.floor(typedRace.lap_reduction / 60)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
                <span className="text-sm text-gray-500" id="time-reduction-display"></span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Ange hur många minuter tiden ska minska varje varv
              </p>
            </div>
          )}

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

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('type').addEventListener('change', function() {
            const timeReductionContainer = document.getElementById('time-reduction-container');
            if (timeReductionContainer) {
              timeReductionContainer.remove();
            }
            if (this.value === 'frontyard') {
              const container = document.createElement('div');
              container.id = 'time-reduction-container';
              container.innerHTML = \`
                <label for="time_reduction" class="block text-sm font-medium text-gray-700 mb-1">
                  Tidsreduktion per varv (minuter)
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    id="time_reduction"
                    name="time_reduction"
                    min="1"
                    value="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  />
                  <span class="text-sm text-gray-500" id="time-reduction-display"></span>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Ange hur många minuter tiden ska minska varje varv
                </p>
              \`;
              this.parentElement.parentElement.insertBefore(container, this.parentElement.nextSibling);
              document.getElementById('time_reduction').addEventListener('input', function() {
                const minutes = parseInt(this.value) || 0;
                document.getElementById('time-reduction-display').textContent = \`(\${minutes} minuter)\`;
              });
            }
          });

          document.getElementById('interval_time').addEventListener('input', function() {
            const minutes = parseInt(this.value) || 0;
            const display = document.getElementById('interval-time-display');
            display.textContent = \`(\${minutes} minuter)\`;
          });

          // Trigger initial display
          document.getElementById('interval_time').dispatchEvent(new Event('input'));
          if (document.getElementById('time_reduction')) {
            document.getElementById('time_reduction').dispatchEvent(new Event('input'));
          }
        `
      }} />
    </div>
  );
} 