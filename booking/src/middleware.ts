import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req, res });

  // Check if the user is authenticated
  const {data: { user },} = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith('/admin') &&
    !['/admin/login', '/admin/callback'].includes(pathname)
  ) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res;
}
