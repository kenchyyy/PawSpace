// app/admin/callback/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSideClient } from '@/lib/supabase/CreateClientSideClient';
import { Loader2 } from 'lucide-react';

const supabase = createClientSideClient(); 

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession(); 
        if (error) {
          setError(error.message);
          return;
        }

        if (!data.session) {
          setError(error);
          return;
        }

        const res = await fetch('/api/login/callback',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.session.user.email })
        })

        const responseJson = await res.json();

        if(!res.ok) {
          setError(responseJson.error + " redirecting to login page...")

          setTimeout(() => {
            supabase.auth.signOut();
            router.push('/login');
          }, 3000);
        }

        //handle redirect based on response portal and user whitelist
        responseJson.portal === "admin"?   router.push('/admin')   :   router.push('/customer') ;
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while processing your request.');
      }
    };

    checkSession();
  }, [router]);

  return (
    <>
      {error ? (
        <div className=' text-white'>Error: {error}</div>
      ) : (
        <Loader2 className='text-white animate-spin' />
      )}
    </>
  );
}
