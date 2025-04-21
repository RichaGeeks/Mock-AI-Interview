// app/interview/results/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InterviewResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resultsData, setResultsData] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    // Get and parse the interview data from URL
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setResultsData(parsedData);
      } catch (error) {
        console.error('Error parsing results data:', error);
        alert('Failed to load interview results');
        router.push('/');
      }
    } else {
      // No data found, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  // Toggle question details expansion
  const toggleQuestionExpand = (index) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(index);
    }
  };

  // Display loading state while data is being parsed
  if (!resultsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { role, questions, answers, feedback } = resultsData;
  const { questionFeedback, overallFeedback } = feedback;

  // Function to determine score color class
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-blue-100 text-blue-800 rounded-full mb-4">
            Interview Complete
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your {role} Interview Results</h1>
          <p className="mt-2 text-xl text-gray-600">
            Overall Score: 
            <span className={`ml-2 text-2xl font-bold ${getScoreColorClass(overallFeedback.overallScore)}`}>
              {overallFeedback.overallScore}/100
            </span>
          </p>
        </div>

        {/* Overall Feedback Card */}
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
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1">
                {overallFeedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-700">{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Question-by-Question Feedback */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Question-by-Question Feedback</h2>
        
        <div className="space-y-4 mb-12">
          {questionFeedback.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleQuestionExpand(index)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                  <p className="text-gray-600 line-clamp-1">{questions[index]}</p>
                </div>
                <div className="flex items-center">
                  <span className={`font-bold ${getScoreColorClass(item.score)}`}>{item.score}/100</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ml-2 text-gray-400 transition-transform ${expandedQuestion === index ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedQuestion === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Question:</h4>
                    <p className="text-gray-900">{questions[index]}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer:</h4>
                    <p className="text-gray-900">{answers[index]}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback:</h4>
                    <p className="text-gray-900">{item.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-center"
          >
            Return to Home
          </Link>
          
          <Link 
            href="/interview/setup" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center"
          >
            Start Another Interview
          </Link>
        </div>
      </div>
    </div>
  );
}