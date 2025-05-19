// supabase-provider.tsx
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  useEffect(() => {
    console.log('Supabase client initialized on the client.');
  }, [supabaseClient]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default SupabaseProvider;