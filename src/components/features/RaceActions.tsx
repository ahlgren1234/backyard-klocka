'use client';

import { useRouter } from 'next/navigation';

interface RaceActionsProps {
  raceId: string;
}

export default function RaceActions({ raceId }: RaceActionsProps) {
  const router = useRouter();

  const handleStartRace = async () => {
    // TODO: Implementera start av tävling
    console.log('Starta tävling:', raceId);
  };

  const handleEditRace = () => {
    router.push(`/dashboard/races/${raceId}/edit`);
  };

  return (
    <div className="mt-8 flex gap-4">
      <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={handleStartRace}
      >
        Starta tävling
      </button>
      <button 
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        onClick={handleEditRace}
      >
        Redigera
      </button>
    </div>
  );
} 