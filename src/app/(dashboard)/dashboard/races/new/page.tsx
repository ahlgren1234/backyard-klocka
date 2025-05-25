import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Race } from '@/lib/supabase/database.types';

function formatIntervalTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} sekunder`;
  } else if (remainingSeconds === 0) {
    return `${minutes} minuter`;
  } else {
    return `${minutes} min ${remainingSeconds} sek`;
  }
}

export default async function NewRacePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  async function createRace(formData: FormData) {
    'use server';
    
    const minutes = parseInt(formData.get('interval_time') as string);
    const seconds = minutes * 60;
    
    const timeReductionMinutes = parseInt(formData.get('time_reduction') as string);
    const timeReductionSeconds = timeReductionMinutes * 60;
    
    const supabase = await createClient();
    const { error } = await supabase
      .from('races')
      .insert({
        user_id: userId,
        name: formData.get('name') as string,
        type: formData.get('type') as 'backyard' | 'frontyard',
        lap_distance: parseInt(formData.get('lap_distance') as string),
        interval_time: seconds,
        lap_reduction: timeReductionSeconds,
        status: 'draft',
      });

    if (error) {
      console.error('Error creating race:', error);
      return;
    }

    redirect('/dashboard');
  }

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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Skapa ny tävling</h1>

        <form action={createRace} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tävlingsnamn
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
              <span className="text-sm text-gray-500" id="interval-time-display"></span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Ange tiden i minuter (t.ex. 5 för 5 minuter)
            </p>
          </div>

          <div id="time-reduction-container" className="hidden">
            <label htmlFor="time_reduction" className="block text-sm font-medium text-gray-700 mb-1">
              Tidsreduktion per varv (minuter)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="time_reduction"
                name="time_reduction"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
              <span className="text-sm text-gray-500" id="time-reduction-display"></span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Ange hur många minuter tiden ska minska varje varv
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Skapa tävling
            </button>
          </div>
        </form>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('type').addEventListener('change', function() {
            const timeReductionContainer = document.getElementById('time-reduction-container');
            timeReductionContainer.classList.toggle('hidden', this.value === 'backyard');
          });

          document.getElementById('interval_time').addEventListener('input', function() {
            const minutes = parseInt(this.value) || 0;
            const display = document.getElementById('interval-time-display');
            display.textContent = \`(\${minutes} minuter)\`;
          });

          document.getElementById('time_reduction').addEventListener('input', function() {
            const minutes = parseInt(this.value) || 0;
            const display = document.getElementById('time-reduction-display');
            display.textContent = \`(\${minutes} minuter)\`;
          });
        `
      }} />
    </div>
  );
} 