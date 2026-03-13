import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// POST - Simulate upgrade
export async function POST(request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ is_upgraded: true })
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to upgrade' }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
