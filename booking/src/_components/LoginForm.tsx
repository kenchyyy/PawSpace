'use client';

import { Button } from '@/_components/ui/Button';
import React from 'react';
import { Card, CardFooter, CardHeader, CardTitle } from '@/_components/ui/card';
interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export default function LoginForm({handleLogin}: LoginFormProps) {

  return (
    <Card className="w-96 max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Portal</CardTitle>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
              Sign in with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}