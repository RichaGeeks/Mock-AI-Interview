// app/interview/setup/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InterviewSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    experience: '1-3',
    skills: '',
    questionCount: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save this data and proceed
    router.push(`/interview/persona?${new URLSearchParams(formData).toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview Setup</h1>
        <p className="mt-2 text-lg text-gray-600">
          Customize your mock interview experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Job Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="e.g., Frontend Developer, Data Scientist"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Paste the job description or key requirements"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience *
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Key Skills Required *
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="e.g., React, Node.js, Python, SQL"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
          </div>

          <div>
            <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions *
            </label>
            <select
              id="questionCount"
              name="questionCount"
              value={formData.questionCount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10">10</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to Persona Selection
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}