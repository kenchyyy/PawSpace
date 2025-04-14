import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client directly
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // Disable cookie persistence
      autoRefreshToken: false // Disable token refresh
    }
  }
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check whitelist directly without auth session
    const { data, error } = await supabase
      .from('admin_whitelist')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { 
            success: true,
            portal: 'customer'
         },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        portal: 'admin'
      },
      { status: 200 },
    );

  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}