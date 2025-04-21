// app/about/page.js
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About MockAI Interview</h1>
        <p className="text-xl text-gray-600">Revolutionizing interview preparation with AI</p>
      </div>

      <div className="bg-white shadow rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          At MockAI Interview, we're transforming how candidates prepare for job interviews. 
          Our AI-powered platform provides realistic mock interviews with instant feedback, 
          helping you identify strengths and areas for improvement.
        </p>
        <p className="text-gray-600">
          Founded in 2023, we've helped over 10,000 users land their dream jobs through 
          personalized interview practice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Select your target job role and skills</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Practice with AI-powered interviewers</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Receive instant feedback and scores</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Track your progress over time</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">The Team</h2>
          <p className="text-gray-600 mb-4">
            We're a passionate team of engineers, designers, and HR professionals 
            dedicated to making interview preparation accessible to everyone.
          </p>
          <p className="text-gray-600">
            Our AI technology leverages cutting-edge natural language processing to 
            simulate real interview scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}