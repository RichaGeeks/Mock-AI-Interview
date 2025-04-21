// app/interview/session/page.js
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function InterviewSession() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get interview parameters from URL
  const persona = searchParams.get('persona');
  const role = searchParams.get('role');
  const description = searchParams.get('description');
  const experience = searchParams.get('experience');
  const skills = searchParams.get('skills');
  const questionCount = parseInt(searchParams.get('questionCount') || '5');

  // State variables
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [processingFeedback, setProcessingFeedback] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);

  const personaData = {
    male: {
      name: 'Alex Johnson',
      videoSrc: '/videos/male-interviewer.mp4',
      imageSrc: '/images/malepersona.jpg',
    },
    female: {
      name: 'Sarah Chen',
      videoSrc: '/videos/female-interviewer.mp4',
      imageSrc: '/images/femalepersona.jpg',
    }
  };

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Setup user camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera and microphone. Please make sure they are connected and permissions are granted.');
      }
    }

    setupCamera();

    // Cleanup function
    return () => {
      if (userVideoRef.current && userVideoRef.current.srcObject) {
        const tracks = userVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Generate interview questions using Gemini AI
  useEffect(() => {
    async function generateQuestions() {
      setLoading(true);
      try {
        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Create prompt for generating interview questions
        const prompt = `Generate ${questionCount} realistic interview questions for a ${role} position with ${experience} years of experience. 
        The job description is: ${description}
        Required skills: ${skills}
        
        Format the response as a JSON array of strings with ONLY the questions.
        Example format: ["Question 1?", "Question 2?", "Question 3?"]`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse JSON response carefully
        try {
          const parsedQuestions = JSON.parse(responseText.trim());
          if (Array.isArray(parsedQuestions) && parsedQuestions.length >= questionCount) {
            setQuestions(parsedQuestions.slice(0, questionCount));
          } else {
            throw new Error('Invalid response format');
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          // Fallback to split by newlines or use a default set of questions
          const fallbackQuestions = responseText.split('\n')
            .filter(q => q.trim().length > 0)
            .map(q => q.replace(/^\d+\.\s*/, '').trim())
            .slice(0, questionCount);
            
          if (fallbackQuestions.length >= questionCount) {
            setQuestions(fallbackQuestions);
          } else {
            // Ultimate fallback: generic questions
            setQuestions([
              `Tell me about your experience with ${role}.`,
              `What are your strengths when it comes to ${skills}?`,
              `How would you handle a difficult situation in this role?`,
              `Why are you interested in this position?`,
              `What challenges do you anticipate in this role?`
            ].slice(0, questionCount));
          }
        }
      } catch (error) {
        console.error('Error generating questions:', error);
        alert('Failed to generate interview questions. Please try again.');
        // Set some default questions as fallback
        setQuestions([
          `Tell me about your experience with ${role}.`,
          `What are your strengths when it comes to ${skills}?`,
          `How would you handle a difficult situation in this role?`,
          `Why are you interested in this position?`,
          `What challenges do you anticipate in this role?`
        ].slice(0, questionCount));
      } finally {
        setLoading(false);
      }
    }

    generateQuestions();
  }, [role, description, experience, skills, questionCount]);

  // Handle recording start
  const startRecording = () => {
    if (!userVideoRef.current || !userVideoRef.current.srcObject) {
      alert('Camera not initialized. Please reload the page.');
      return;
    }

    audioChunksRef.current = [];
    const audioStream = userVideoRef.current.srcObject;
    
    try {
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recorder:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  // Handle recording stop
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      mediaRecorderRef.current.onstop = () => {
        // Store the answer with the current question
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = transcript;
        setAnswers(updatedAnswers);
      };
    }
  };

  // Navigate to next question or finish interview
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setAllQuestionsAnswered(true);
      generateFeedback();
    }
  };

  // Generate feedback for all answers
  const generateFeedback = async () => {
    setProcessingFeedback(true);
    
    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const interviewData = {
        role,
        description,
        experience,
        skills,
        questions,
        answers
      };
      
      // Create prompt for generating feedback
      const prompt = `
      You are an expert interviewer evaluating a candidate for a ${role} position with ${experience} years of experience.
      
      Job Description: ${description}
      Required Skills: ${skills}
      
      The candidate answered the following questions:
      ${questions.map((q, i) => `
      Question ${i+1}: ${q}
      Candidate's Answer: ${answers[i] || "No answer provided"}
      `).join('\n')}
      
      Provide detailed feedback on each answer and an overall evaluation with:
      1. Strengths
      2. Areas for improvement
      3. A score out of 100
      
      Format the response as a JSON object with this structure:
      {
        "questionFeedback": [
          {
            "question": "Question text",
            "answer": "Answer text",
            "feedback": "Detailed feedback",
            "score": 85 (a number between 0-100)
          }
        ],
        "overallFeedback": {
          "strengths": ["Strength 1", "Strength 2"],
          "improvements": ["Improvement 1", "Improvement 2"],
          "overallScore": 82 (a number between 0-100)
        }
      }`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse the JSON response
      const feedbackData = JSON.parse(responseText);
      
      // Navigate to results page with the feedback data
      router.push(`/interview/results?data=${encodeURIComponent(JSON.stringify({
        role,
        questions,
        answers,
        feedback: feedbackData
      }))}`);
      
    } catch (error) {
      console.error('Error generating feedback:', error);
      alert('Failed to generate feedback. Please try again.');
      setProcessingFeedback(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Preparing your interview questions...</p>
        </div>
      </div>
    );
  }

  // Render feedback processing state
  if (processingFeedback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Analyzing your interview responses...</p>
          <p className="mt-2 text-gray-600">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{role} Interview</h1>
          <p className="text-lg text-gray-600">
            Interviewer: {personaData[persona]?.name || 'Interviewer'}
          </p>
        </div>

        {/* Interview Arena */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Video area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Interviewer Video */}
            <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">
              {/* We'd use actual video here, but for now just showing the persona image */}
              <img 
                src={personaData[persona]?.imageSrc || '/images/default-persona.jpg'} 
                alt="Interviewer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-md text-white">
                {personaData[persona]?.name || 'Interviewer'}
              </div>
            </div>
              
            {/* Candidate Video (User) */}
            <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">
              <video 
                ref={userVideoRef}
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-md text-white">
                You
              </div>
            </div>
          </div>

          {/* Question and Answer area */}
          <div className="p-6 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <p className="text-xl mt-2">{questions[currentQuestionIndex]}</p>
            </div>
              
            {/* Recording controls and transcript */}
            <div className="space-y-6">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`px-6 py-3 rounded-lg ${isRecording ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white font-medium flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </button>
                  
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className={`px-6 py-3 rounded-lg ${!isRecording ? 'bg-gray-400' : 'bg-gray-700 hover:bg-gray-800'} text-white font-medium flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Recording
                </button>
              </div>
                
              {/* Transcript area */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Response:</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-24">
                  {isRecording && !transcript && (
                    <p className="text-gray-500 italic">Speak now... (transcript will appear here)</p>
                  )}
                  {transcript ? (
                    <p>{transcript}</p>
                  ) : answers[currentQuestionIndex] ? (
                    <p>{answers[currentQuestionIndex]}</p>
                  ) : (
                    <p className="text-gray-500 italic">Record your answer</p>
                  )}
                </div>
              </div>
                
              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Exit Interview
                </button>
                  
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestionIndex] && !transcript}
                  className={`px-6 py-2 rounded-lg ${!answers[currentQuestionIndex] && !transcript ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium`}
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{questions.length} Questions Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}