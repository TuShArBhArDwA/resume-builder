import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET - List all resumes for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
    }

    return NextResponse.json({ resumes });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new resume
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, title, template_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .insert([{
        user_id,
        title: title || 'Untitled Resume',
        template_id: template_id || 'classic',
        personal_info: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
    }

    return NextResponse.json({ resume });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
