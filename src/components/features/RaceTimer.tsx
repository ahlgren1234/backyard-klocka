'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface RaceTimerProps {
  raceId: string;
  intervalTime: number;
  status: 'not_started' | 'in_progress' | 'completed';
  onStatusChange: (newStatus: 'not_started' | 'in_progress' | 'completed') => void;
}

export default function RaceTimer({ raceId, intervalTime, status, onStatusChange }: RaceTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(intervalTime);
  const [isRunning, setIsRunning] = useState<boolean>(status === 'in_progress');
  const [currentLap, setCurrentLap] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onStatusChange('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, timeLeft, onStatusChange]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from('races')
      .update({ status: 'in_progress' })
      .eq('id', raceId);

    if (!error) {
      setIsRunning(true);
      onStatusChange('in_progress');
    }
  };

  const handleStop = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from('races')
      .update({ status: 'completed' })
      .eq('id', raceId);

    if (!error) {
      setIsRunning(false);
      onStatusChange('completed');
    }
  };

  const handleLapComplete = async () => {
    setCurrentLap((prev) => prev + 1);
    setTimeLeft(intervalTime);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tävlingsstatus</h2>
        <p className="text-gray-600">
          Status: {status === 'not_started' ? 'Inte startad' : status === 'in_progress' ? 'Pågående' : 'Avslutad'}
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {formatTime(timeLeft)}
        </div>
        <p className="text-gray-600">Återstående tid till nästa varv</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-2xl font-bold text-gray-900">{currentLap}</p>
        <p className="text-gray-600">Genomförda varv</p>
      </div>

      <div className="flex justify-center gap-4">
        {status === 'not_started' && (
          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Starta tävling
          </button>
        )}
        {status === 'in_progress' && (
          <>
            <button
              onClick={handleLapComplete}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Varv klart
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Avsluta tävling
            </button>
          </>
        )}
      </div>
    </div>
  );
} 