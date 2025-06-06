'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Race } from '@/lib/supabase/database.types';
import { useRouter } from 'next/navigation';

interface RaceDisplayProps {
  race: Race;
  onStatusChange: (newStatus: 'not_started' | 'in_progress' | 'completed' | 'active' | 'draft') => void;
}

export default function RaceDisplay({ race, onStatusChange }: RaceDisplayProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(race.interval_time);
  const [isRunning, setIsRunning] = useState<boolean>(race.status === 'in_progress' || race.status === 'active');
  const [currentLap, setCurrentLap] = useState<number>(0);
  const [countdownToStart, setCountdownToStart] = useState<number | null>(null);

  useEffect(() => {
    console.log('Race prop updated:', race);
    setTimeLeft(race.interval_time);
    setIsRunning(race.status === 'in_progress' || race.status === 'active');
    setCurrentLap(0);
    
    if (race.start_time && (race.status === 'draft' || race.status === 'not_started')) {
      const startTime = new Date(race.start_time).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((startTime - now) / 1000);
      setCountdownToStart(diff > 0 ? diff : 0);
    } else {
      setCountdownToStart(null);
    }
  }, [race]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    console.log('Starting race...');
    const supabase = createClient();
    const { error } = await supabase
      .from('races')
      .update({ 
        status: 'active',
        start_time: race.start_time ? race.start_time : new Date().toISOString()
      })
      .eq('id', race.id);

    if (!error) {
      setIsRunning(true);
      onStatusChange('active');
    } else {
      console.error('Error starting race:', error);
    }
  };

  const handleStop = async () => {
    // Spara nuvarande tid och varv innan bekräftelse
    const currentTime = timeLeft;
    const currentLapCount = currentLap;
    
    if (!window.confirm('Är du säker på att du vill avsluta tävlingen?')) {
      // Om användaren avbryter, återställ till sparade värden
      setTimeLeft(currentTime);
      setCurrentLap(currentLapCount);
      return;
    }

    console.log('Stopping race...');
    const supabase = createClient();
    const { error } = await supabase
      .from('races')
      .update({ 
        status: 'completed'
      })
      .eq('id', race.id);

    if (!error) {
      setIsRunning(false);
      onStatusChange('completed');
      // Navigera till resultatsidan
      router.push(`/dashboard/races/${race.id}/results`);
    } else {
      console.error('Error stopping race:', error);
    }
  };

  // Hantera nedräkning till start
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (countdownToStart !== null && countdownToStart > 0) {
      console.log('Starting countdown:', countdownToStart);
      interval = setInterval(() => {
        setCountdownToStart(prev => {
          if (prev === null || prev <= 0) return 0;
          const next = prev - 1;
          if (next === 0) {
            console.log('Countdown finished, starting race...');
            handleStart();
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        console.log('Clearing countdown interval');
        clearInterval(interval);
      }
    };
  }, [countdownToStart]);

  // Hantera varvtimer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isRunning && timeLeft > 0) {
      console.log('Starting lap timer:', timeLeft);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            console.log('Lap time finished');
            // Räkna upp varvet och beräkna nästa intervall
            const nextLap = currentLap + 1;
            console.log('Updating lap count to:', nextLap);
            
            // Uppdatera current_lap i databasen
            const supabase = createClient();
            supabase
              .from('races')
              .update({ 
                current_lap: nextLap,
                status: 'active' // Säkerställ att statusen är 'active'
              })
              .eq('id', race.id)
              .then(({ error }) => {
                if (error) {
                  console.error('Error updating lap count:', error);
                } else {
                  console.log('Successfully updated lap count to:', nextLap);
                }
              });

            setCurrentLap(nextLap);
            const nextIntervalTime = race.type === 'frontyard'
              ? Math.max(0, race.interval_time - (race.lap_reduction * nextLap))
              : race.interval_time;
            return nextIntervalTime;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        console.log('Clearing lap timer');
        clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft, race.type, race.interval_time, race.lap_reduction, currentLap, race.id]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center w-full mx-auto">
        <h1 className="text-6xl font-bold mb-4">{race.name}</h1>
        <p className="text-2xl text-gray-300 mb-12">Typ: {race.type === 'backyard' ? 'Backyard Ultra' : 'Frontyard'}</p>

        {/* Backyard Ultra Layout */}
        {race.type === 'backyard' && (
          <div className="w-full">
            {/* Countdown to Start */}
            {countdownToStart !== null && countdownToStart > 0 && (
              <div className="mb-12">
                <p className="text-3xl mb-4">Tävlingen startar om</p>
                <p className="text-8xl font-bold">{formatTime(countdownToStart)}</p>
                {race.start_time && (
                  <p className="text-xl mt-4 text-gray-400">
                    {new Date(race.start_time).toLocaleString('sv-SE', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            )}

            {/* Running Display */}
            {isRunning && (
              <div className="grid grid-cols-3 gap-16 items-center text-center px-4">
                {/* Current Lap Info */}
                <div>
                  <p className="text-3xl mb-2 text-gray-400">Varv Nr:</p>
                  <p className="text-9xl font-bold">{currentLap + 1}</p>
                </div>

                {/* Time to next start */}
                <div>
                  <p className="text-3xl mb-2 text-gray-400">Tid till nästa start:</p>
                  <p className="text-9xl font-bold">{formatTime(timeLeft)}</p>
                </div>

                {/* Distance after this lap */}
                <div>
                  <p className="text-3xl mb-2 text-gray-400">Distans (hittills):</p>
                  <p className="text-9xl font-bold">{(race.lap_distance * currentLap / 1000).toFixed(1)} km</p>
                </div>

              </div>
            )}

            {/* Stop Button */}
            {isRunning && (
              <div className="mt-20 flex justify-center">
                 <button
                  onClick={handleStop}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg text-2xl hover:bg-red-700 transition-colors"
                >
                  Avsluta tävling
                </button>
              </div>
            )}

            {/* Not Running / Countdown Finished */}
            {!isRunning && countdownToStart === 0 && ( /* Also show button if status is draft/not_started and countdown is 0 */
               <div className="mt-16 flex justify-center">
                <button
                  onClick={handleStart}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-2xl hover:bg-green-700 transition-colors"
                >
                  Starta tävling
                </button>
              </div>
            )}

            {/* Completed Status */}
            {race.status === 'completed' && (
              <p className="text-4xl font-bold text-green-500 mt-8">Tävlingen är avslutad!</p>
            )}

          </div>
        )}

        {/* Add Frontyard Layout here if needed later */}
        {race.type !== 'backyard' && (
           <div className="w-full">
             {/* Keep existing Frontyard/default layout or define a new one */}
             {/* For now, just show a message */}
             <p className="text-2xl">Visar timer för {race.type}. Layout för Frontyard kommer snart.</p>
             {/* You can copy/paste the old layout from the previous version if you want to keep it */}
           </div>
        )}

      </div>
    </div>
  );
} 