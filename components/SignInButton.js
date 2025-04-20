// components/SignInButton.js
'use client';

import { signIn } from 'next-auth/react';

export default function SignInButton({ large = false, dark = false }) {
  const buttonClass = large 
    ? `px-8 py-4 rounded-lg font-medium text-lg ${dark ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition`
    : `px-4 py-2 rounded-lg ${dark ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition`;

  return (
    <button 
      onClick={() => signIn('google')}
      className={buttonClass}
    >
      Sign In with Google
    </button>
  );
}