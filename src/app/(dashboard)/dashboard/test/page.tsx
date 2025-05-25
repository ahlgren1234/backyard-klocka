import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import SupabaseTest from '@/components/features/SupabaseTest';

export default async function TestPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Supabase Test</h1>
      <SupabaseTest />
    </div>
  );
} 