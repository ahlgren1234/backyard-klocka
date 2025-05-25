'use client';

import { deleteRace } from '@/app/actions/races';

interface DeleteRaceButtonProps {
  userId: string;
  raceId: string;
}

export default function DeleteRaceButton({ userId, raceId }: DeleteRaceButtonProps) {
  return (
    <form action={deleteRace} className="inline">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="raceId" value={raceId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm('Är du säker på att du vill ta bort denna tävling? Detta går inte att ångra.')) {
            e.preventDefault();
          }
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Ta bort tävling
      </button>
    </form>
  );
} 