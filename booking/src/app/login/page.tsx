'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (process.env.NODE_ENV === 'test') return
    try {
      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login/callback`,
        },
      });

      if (error) {
        setError('Failed to load google login link.');
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-96 max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending login link...
                </>
              ) : (
                'Sign in with Google'
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}