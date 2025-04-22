'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InterviewResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchInterviewResults = async () => {
      try {
        const interviewId = searchParams.get('id');
        if (!interviewId) {
          throw new Error('No interview ID provided');
        }

        const response = await fetch(`/api/interviews/get?id=${interviewId}`);
        
        // Check for HTML error responses
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Server error: ${text.substring(0, 100)}`);
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results');
        }

        if (!data) {
          throw new Error('No data received');
        }

        setResultsData(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message);
        router.push('/interview/setup');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewResults();
  }, [searchParams, router]);

  const toggleQuestionExpand = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your interview results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Results</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link
            href="/interview/setup"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <Link
            href="/interview/setup"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    );
  }

  const { role, questions, answers, feedback } = resultsData;
  const { questionFeedback, overallFeedback } = feedback;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-blue-100 text-blue-800 rounded-full mb-4 text-sm font-medium">
            Interview Complete
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your {role} Interview Results</h1>
          <p className="text-xl text-gray-600">
            Overall Score: 
            <span className={`ml-2 font-bold ${getScoreColorClass(overallFeedback.overallScore)}`}>
              {overallFeedback.overallScore}/100
            </span>
          </p>
        </div>

        {/* Overall Feedback */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Feedback</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {overallFeedback.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1">
                {overallFeedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-700">{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Feedback</h2>
        
        <div className="space-y-4 mb-12">
          {questionFeedback.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleQuestionExpand(index)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">Question {index + 1}</h3>
                  <p className="text-gray-600 truncate">{questions[index]}</p>
                </div>
                <div className="flex items-center ml-4">
                  <span className={`font-bold ${getScoreColorClass(item.score)}`}>
                    {item.score}/100
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ml-2 text-gray-400 transition-transform ${expandedQuestion === index ? 'transform rotate-180' : ''}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {expandedQuestion === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Question:</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{questions[index]}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer:</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{answers[index] || "No answer provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback:</h4>
                    <p className="text-gray-900 whitespace-pre-wrap">{item.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-center transition-colors"
          >
            Return to Home
          </Link>
          
          <Link
            href="/interview/setup"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center transition-colors"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    </div>
  );
}