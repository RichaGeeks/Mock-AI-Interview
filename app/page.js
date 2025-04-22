// app/page.js
'use client';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();

  // Handle the UI update after sign in
  useEffect(() => {
    if (status === 'authenticated') {
      // This will force a UI update without full page reload
      window.dispatchEvent(new Event('visibilitychange'));
    }
  }, [status]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          MockAI Interview
        </Link>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden sm:inline">
              Welcome, {session.user.name?.split(' ')[0] || 'User'}
            </span>
            <div className="flex gap-3">
              <Link
                href="/interview/setup/"
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition whitespace-nowrap"
              >
                Take Interview
              </Link>
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
              >
                My Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="hidden md:block">
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              Sign In
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Ace Your Next Interview with AI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
          Practice with realistic AI interviews, get instant feedback, and track your progress over time.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          {session ? (
            <Link
              href="/interview/setup/"
              className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base md:text-lg font-medium text-center"
            >
              Take an Interview
            </Link>
          ) : (
            <>
              <button
                onClick={() => signIn('google')}
                className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base md:text-lg font-medium text-center"
              >
                Sign In
              </button>
              <Link
                href="/about"
                className="px-6 py-3 md:px-8 md:py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-base md:text-lg font-medium text-center"
              >
                Learn More
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 md:mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Feature 1 */}
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="bg-blue-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Customize Your Interview</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Select your job role, experience level, and skills to get tailored interview questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="bg-blue-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Realistic Practice</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Experience video interviews with different personas and record your responses.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="bg-blue-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Instant Feedback</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Get AI-powered scores and detailed feedback on each answer immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 md:mb-16">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 mr-3 md:mr-4 flex items-center justify-center text-blue-600 font-bold">
                  SK
                </div>
                <div>
                  <h4 className="font-medium">Sarah K.</h4>
                  <p className="text-gray-500 text-xs md:text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm md:text-base">
                "MockAI helped me prepare for my FAANG interviews. The feedback was so detailed I could pinpoint exactly what to improve."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 mr-3 md:mr-4 flex items-center justify-center text-blue-600 font-bold">
                  JL
                </div>
                <div>
                  <h4 className="font-medium">James L.</h4>
                  <p className="text-gray-500 text-xs md:text-sm">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm md:text-base">
                "I was nervous about behavioral interviews, but practicing with different personas gave me the confidence I needed."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who improved their interview skills with MockAI.
          </p>
          <div className="flex justify-center">
            {session ? (
              <Link
                href="/interview/setup/"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-medium"
              >
                Take an Interview
              </Link>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 md:py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">MockAI Interview</div>
              <p className="text-gray-400 text-sm md:text-base">The smart way to prepare for interviews</p>
            </div>
            <div className="flex gap-4 md:gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm md:text-base">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition text-sm md:text-base">Terms</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition text-sm md:text-base">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} MockAI Interview. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
