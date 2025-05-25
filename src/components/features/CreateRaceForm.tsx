'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type RaceType = 'backyard' | 'frontyard';

export default function CreateRaceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'backyard' as RaceType,
    lap_distance: 6704, // Standard backyard-längd i meter
    interval_time: 3600, // 1 timme i sekunder
    lap_reduction: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // För backyard-tävlingar, sätt lap_reduction till 0
      const submitData = {
        ...formData,
        lap_reduction: formData.type === 'backyard' ? 0 : formData.lap_reduction,
      };

      const response = await fetch('/api/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'type' ? value : Number(value),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded">
          {error}
        </div>
      )}

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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="interval_time" className="block text-sm font-medium text-gray-700">
          Tidsintervall (sekunder)
        </label>
        <input
          type="number"
          id="interval_time"
          name="interval_time"
          required
          min="1"
          value={formData.interval_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {formData.type === 'frontyard' && (
        <div>
          <label htmlFor="lap_reduction" className="block text-sm font-medium text-gray-700">
            Minskning per varv (sekunder)
          </label>
          <input
            type="number"
            id="lap_reduction"
            name="lap_reduction"
            required
            min="0"
            value={formData.lap_reduction}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Skapar...' : 'Skapa tävling'}
      </button>
    </form>
  );
} 