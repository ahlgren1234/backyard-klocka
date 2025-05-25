import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
// Vi behöver inte createClient här längre då formuläret/server action hanterar det
// import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
// Importera CreateRaceForm komponenten
import CreateRaceForm from '@/components/features/CreateRaceForm';

// Vi behöver inte formatIntervalTime här längre
// function formatIntervalTime(seconds: number): string {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
  
//   if (minutes === 0) {
//     return `${remainingSeconds} sekunder`;
//   } else if (remainingSeconds === 0) {
//     return `${minutes} minuter`;
//   } else {
//     return `${minutes} min ${remainingSeconds} sek`;
//   }
// }

export default async function NewRacePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // createRace server action är flyttad till actions/races.ts
  // async function createRace(formData: FormData) { ... }

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

        {/* Rendera CreateRaceForm komponenten */}
        <CreateRaceForm />

      </div>
      {/* Ta bort den inbäddade script-taggen */}
      {/* <script dangerouslySetInnerHTML={{ __html: `...` }} /> */}
    </div>
  );
} 