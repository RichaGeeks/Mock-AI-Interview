// app/interview/persona/page.js
'use client';


import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PersonaSelection() {
  const searchParams = useSearchParams();
  
  // Get interview parameters from URL
  const role = searchParams.get('role');
  const description = searchParams.get('description');
  const experience = searchParams.get('experience');
  const skills = searchParams.get('skills');
  const questionCount = searchParams.get('questionCount');

  // Persona data
  const personas = [
    {
      id: 'male',
      name: 'Alex Johnson',
      title: 'Senior Tech Interviewer',
      description: 'Formal and technical, focuses on depth of knowledge',
      videoPreview: '/images/malepersona.jpg',
      image: '/images/malepersona.jpg'
    },
    {
      id: 'female',
      name: 'Sarah Chen',
      title: 'HR & Behavioral Specialist',
      description: 'Friendly but thorough, emphasizes communication skills',
      videoPreview: '/images/femalepersona.jpg',
      image: '/images/femalepersona.jpg'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Select Your Interviewer</h1>
        <p className="mt-2 text-lg text-gray-600">
          Choose a persona that matches your practice needs
        </p>
      </div>

      <div className="mb-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Interview Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><span className="font-medium">Role:</span> {role}</p>
            <p className="text-gray-600"><span className="font-medium">Experience:</span> {experience} years</p>
          </div>
          <div>
            <p className="text-gray-600"><span className="font-medium">Skills:</span> {skills}</p>
            <p className="text-gray-600"><span className="font-medium">Questions:</span> {questionCount}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {personas.map((persona) => (
          <Link
            key={persona.id}
            href={{
              pathname: '/interview/session',
              query: {
                persona: persona.id,
                role,
                description,
                experience,
                skills,
                questionCount
              }
            }}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                <img 
                  src={persona.image} 
                  alt={persona.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{persona.name}</h3>
              <p className="text-blue-600 mb-2">{persona.title}</p>
              <p className="text-gray-600 text-center mb-4">{persona.description}</p>
              
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Select {persona.name.split(' ')[0]}
              </button>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link 
          href={{
            pathname: '/interview/setup',
            query: {
              role,
              description,
              experience,
              skills,
              questionCount
            }
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to interview setup
        </Link>
      </div>
    </div>
  );
}