// components/SignInButton.js
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInButton({ large = false, dark = false }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const buttonClass = large 
    ? `px-8 py-4 rounded-lg font-medium text-lg ${dark ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition flex items-center justify-center gap-2`
    : `px-4 py-2 rounded-lg ${dark ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition flex items-center justify-center gap-2`;

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', { callbackUrl: '/dashboard' });
      if (result?.error) {
        console.error('Sign-in failed:', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.refresh(); // Force UI update
    }
  }, [status, router]);

  return (
    <button 
      onClick={handleSignIn}
      disabled={isLoading}
      className={`${buttonClass} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing In...
        </>
      ) : (
        'Sign In with Google'
      )}
    </button>
  );
}