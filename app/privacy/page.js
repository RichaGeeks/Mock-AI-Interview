// app/privacy/page.js
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Account information (name, email, profile picture)</li>
            <li>Interview preferences and settings</li>
            <li>Interview responses and recordings</li>
            <li>Feedback and improvement suggestions</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            Your data helps us:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Provide and improve our services</li>
            <li>Personalize your interview experience</li>
            <li>Develop better AI evaluation models</li>
            <li>Communicate with you about your account</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Security</h2>
          <p className="text-gray-600">
            We implement industry-standard security measures including encryption, 
            access controls, and regular audits. However, no method of transmission 
            over the Internet is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Contact Us</h2>
          <p className="text-gray-600">
            For privacy-related questions, email us at privacy@mockai.com
          </p>
        </div>
      </div>
    </div>
  );
}