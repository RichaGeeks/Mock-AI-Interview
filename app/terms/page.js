// app/terms/page.js
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-xl text-gray-600">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing or using MockAI Interview, you agree to be bound by these Terms. 
            If you disagree, you may not use our service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Responsibilities</h2>
          <p className="text-gray-600 mb-4">
            You agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Provide accurate account information</li>
            <li>Not share your account credentials</li>
            <li>Use the service for lawful purposes only</li>
            <li>Not attempt to reverse-engineer our AI models</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Intellectual Property</h2>
          <p className="text-gray-600">
            All content, including AI models, interview questions, and feedback systems, 
            are owned by MockAI Interview and protected by intellectual property laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Limitation of Liability</h2>
          <p className="text-gray-600">
            MockAI Interview is not responsible for employment decisions made based on 
            practice interviews. Our service provides suggestions, not guarantees.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Changes to Terms</h2>
          <p className="text-gray-600">
            We may modify these terms at any time. Continued use constitutes acceptance.
          </p>
        </div>
      </div>
    </div>
  );
}