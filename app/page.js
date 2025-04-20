// app/page.js
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import SignInButton from '@/components/SignInButton';
import TakeInterviewButton from '@/components/TakeInterviewButton';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-blue-600">MockAI Interview</div>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {session.user.name}</span>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <SignInButton />
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Ace Your Next Interview with AI
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Practice with realistic AI interviews, get instant feedback, and track your progress over time.
        </p>
        
        {session ? (
          <TakeInterviewButton />
        ) : (
          <div className="flex justify-center gap-4">
            <SignInButton large />
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-medium"
            >
              Learn More
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize Your Interview</h3>
              <p className="text-gray-600">
                Select your job role, experience level, and skills to get tailored interview questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Realistic Practice</h3>
              <p className="text-gray-600">
                Experience video interviews with different personas and record your responses.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Feedback</h3>
              <p className="text-gray-600">
                Get AI-powered scores and detailed feedback on each answer immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-medium">Sarah K.</h4>
                  <p className="text-gray-500 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "MockAI helped me prepare for my FAANG interviews. The feedback was so detailed I could pinpoint exactly what to improve."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-medium">James L.</h4>
                  <p className="text-gray-500 text-sm">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I was nervous about behavioral interviews, but practicing with different personas gave me the confidence I needed."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who improved their interview skills with MockAI.
          </p>
          {session ? (
            <TakeInterviewButton dark />
          ) : (
            <SignInButton large dark />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-white mb-2">MockAI Interview</div>
              <p className="text-gray-400">The smart way to prepare for interviews</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition">Terms</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} MockAI Interview. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}