// components/TakeInterviewButton.js
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function TakeInterviewButton({ dark = false }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Handle cases where session might be loading
  if (status === 'loading') {
    return (
      <button 
        disabled
        className={`px-8 py-4 rounded-lg font-medium text-lg ${dark ? 'bg-gray-200 text-gray-600' : 'bg-blue-400 text-white'} transition cursor-not-allowed flex items-center justify-center gap-2`}
      >
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </button>
    );
  }

  return (
    <Link
      href={session ? "/interview/setup" : "#"}
      onClick={(e) => {
        if (!session) {
          e.preventDefault();
          alert('Please sign in first');
        } else {
          setIsLoading(true);
        }
      }}
      className={`px-8 py-4 rounded-lg font-medium text-lg ${dark ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-75' : ''}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Preparing...
        </>
      ) : (
        'Take an Interview'
      )}
    </Link>
  );
}