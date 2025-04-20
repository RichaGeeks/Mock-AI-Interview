// components/TakeInterviewButton.js
'use client';

import Link from 'next/link';

export default function TakeInterviewButton({ dark = false }) {
  return (
    <Link
      href="/interview/setup"
      className={`px-8 py-4 rounded-lg font-medium text-lg ${dark ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition`}
    >
      Take an Interview
    </Link>
  );
}