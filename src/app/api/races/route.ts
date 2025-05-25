import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();

    // Validera input
    if (!body.name || !body.type || !body.lap_distance || !body.interval_time) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    if (body.type === 'frontyard' && !body.lap_reduction) {
      return new NextResponse('Lap reduction required for frontyard races', { status: 400 });
    }

    // För backyard-tävlingar, sätt lap_reduction till 0
    const lap_reduction = body.type === 'backyard' ? 0 : body.lap_reduction;

    const { data, error } = await supabase
      .from('races')
      .insert([
        {
          name: body.name,
          type: body.type,
          lap_distance: body.lap_distance,
          interval_time: body.interval_time,
          lap_reduction,
          user_id: userId,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating race:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/races:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('races')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching races:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/races:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 