"use client";

import { Button } from "@/_components/ui/Button";
import React from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/_components/ui/card";

interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export default function LoginForm({ handleLogin }: LoginFormProps) {
  return (
    <Card className="w-96 max-w-md white">
      <CardHeader>
        <CardTitle className="text-2xl border-b-2 border-violet-700 pb-2">Sign-in to Pawspace</CardTitle>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-violet-950 hover:bg-violet-800 text-white font-semibold py-2 px-4 rounded transition"
          >
            {/* Google SVG Logo */}
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.68 1.22 9.16 3.22l6.83-6.83C36.82 2.64 30.77 0 24 0 14.82 0 6.68 5.48 2.69 13.44l7.98 6.2C12.13 13.19 17.6 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.14 24.55c0-1.64-.15-3.22-.43-4.74H24v9h12.45c-.54 2.88-2.16 5.32-4.62 6.98l7.17 5.56C43.93 37.03 46.14 31.29 46.14 24.55z"/>
                <path fill="#FBBC05" d="M9.67 28.36A14.5 14.5 0 0 1 9.5 24c0-1.52.25-2.99.69-4.36l-7.98-6.2A23.95 23.95 0 0 0 0 24c0 3.82.91 7.44 2.53 10.56l8.14-6.2z"/>
                <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.83l-7.17-5.56c-2.01 1.34-4.58 2.14-8.72 2.14-6.4 0-11.87-3.69-13.83-8.97l-8.14 6.2C6.68 42.52 14.82 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Sign in with Google
          </Button>
        </CardFooter>
      </form>
    </Card>

  );
}
