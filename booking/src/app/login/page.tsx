'use client';

import { useState } from 'react';
import { createClientSideClient } from '@/lib/supabase/CreateClientSideClient';
import LoginForm from '@/_components/LoginForm';


export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClientSideClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    /* setError('');
    setSuccessMessage(''); */

    if (process.env.NODE_ENV === 'test') return
    try {
      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login/callback`,
        },
      });

      if (error) {
        /* setError('Failed to load google login link.'); */
        return;
      }
    } catch (err) {
      /* setError(err instanceof Error ? err.message : 'An unexpected error occurred'); */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm handleLogin={handleSubmit} />
  );
}