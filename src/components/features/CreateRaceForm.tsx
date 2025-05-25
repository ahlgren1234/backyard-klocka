'use client';

import { useState } from 'react';
// Ta bort useRouter eftersom den inte används längre
// import { useRouter } from 'next/navigation';
import { createRace } from '@/app/actions/races'; // Importera server action

type RaceType = 'backyard' | 'frontyard';

export default function CreateRaceForm() {
  // Vi behöver inte hantera loading och error state lokalt på samma sätt nu när vi använder server actions
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'backyard' as RaceType,
    lap_distance: 6704, // Standard backyard-längd i meter
    interval_time: 60, // 1 minut i minuter (input är i minuter)
    lap_reduction: 0,
    start_time: '',
  });

  // Ta bort handleSubmit funktionen, vi använder form action istället
  // const handleSubmit = async (e: React.FormEvent) => { ... };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Hantera start_time som sträng, andra numeriska fält som nummer
      [name]: name === 'name' || name === 'type' || name === 'start_time' ? value : Number(value),
    }));
  };

  return (
    // Använd action prop:en för att anropa server action
    <form action={createRace} className="space-y-6">
      {/* Vi hanterar inte error state här längre på samma sätt */}
      {/* {error && ( ... )} */}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Tävlingsnamn
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tävlingstyp
        </label>
        <select
          id="type"
          name="type"
          required
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
        >
          <option value="backyard">Backyard</option>
          <option value="frontyard">Frontyard</option>
        </select>
      </div>

      <div>
        <label htmlFor="lap_distance" className="block text-sm font-medium text-gray-700">
          Varvlängd (meter)
        </label>
        <input
          type="number"
          id="lap_distance"
          name="lap_distance"
          required
          min="1"
          value={formData.lap_distance}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="interval_time" className="block text-sm font-medium text-gray-700">
          Tidsintervall (minuter)
        </label>
        <input
          type="number"
          id="interval_time"
          name="interval_time"
          required
          min="1"
          value={formData.interval_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
        />
        {/* Ta bort extra visning av minuter här, server action hanterar det nu */}
        {/* <span className="text-sm text-gray-500" id="interval-time-display"></span> */}
      </div>

      {formData.type === 'frontyard' && (
        <div>
          <label htmlFor="lap_reduction" className="block text-sm font-medium text-gray-700">
            Minskning per varv (minuter)
          </label>
          <input
            type="number"
            id="lap_reduction"
            name="lap_reduction"
            required={formData.type === 'frontyard'}
            min="0"
            value={formData.lap_reduction}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          />
          {/* Ta bort extra visning av minuter här, server action hanterar det nu */}
          {/* <span className="text-sm text-gray-500" id="time-reduction-display"></span> */}
        </div>
      )}

      {/* Lägg till fält för planerad starttid */}
      <div>
        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
          Planerad starttid (valfri)
        </label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Lämna tomt för att starta tävlingen manuellt senare.
        </p>
      </div>

      <button
        type="submit"
        // disabled={isLoading} // isLoading hanteras av Next.js useFormStatus hook om du behöver
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Skapa tävling
        {/* {isLoading ? 'Skapar...' : 'Skapa tävling'} */}
      </button>
    </form>
  );
} 