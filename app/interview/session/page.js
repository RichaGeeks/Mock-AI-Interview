'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GoogleGenerativeAI } from '@google/generative-ai';

const personaData = {
  male: {
    id: 'male',
    name: 'Alex Johnson',
    title: 'Senior Tech Interviewer',
    description: 'Formal and technical, focuses on depth of knowledge',
    imageSrc: '/images/malepersona.jpg',
    videoSrc: '/videos/male-interviewer.mp4',
    tips: [
      'Prefers detailed technical answers',
      'Looks for problem-solving approaches',
      'Values clear explanations'
    ]
  },
  female: {
    id: 'female',
    name: 'Sarah Chen',
    title: 'HR & Behavioral Specialist',
    description: 'Friendly but thorough, emphasizes communication skills',
    imageSrc: '/images/femalepersona.jpg',
    videoSrc: '/videos/female-interviewer.mp4',
    tips: [
      'Looks for STAR method responses',
      'Values emotional intelligence',
      'Prefers concise answers'
    ]
  },
  default: {
    id: 'default',
    name: 'Interviewer',
    title: 'Professional Interviewer',
    description: 'Standard interview experience',
    imageSrc: '/images/default-interviewer.jpg',
    videoSrc: '/videos/default-interviewer.mp4',
    tips: [
      'Be clear and professional',
      'Structure your answers',
      'Provide relevant examples'
    ]
  }
};

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

  // State management
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processingFeedback, setProcessingFeedback] = useState(false);
  const [interviewStartTime] = useState(Date.now());

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);

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
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Setup user media
  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Media access error:', error);
      }
    }

    setupMedia();

    return () => {
      if (userVideoRef.current?.srcObject) {
        userVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Generate interview questions
  useEffect(() => {
    async function generateQuestions() {
      setLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Generate ${questionCount} interview questions for ${role} position...`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const parsedQuestions = parseAIQuestions(responseText, questionCount);
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Question generation failed:', error);
        setQuestions(getFallbackQuestions(role, skills, questionCount));
      } finally {
        setLoading(false);
      }
    }

    if (role) generateQuestions();
  }, [role, description, experience, skills, questionCount]);

  // Recording controls
  const startRecording = () => {
    if (!userVideoRef.current?.srcObject) return;

    audioChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(userVideoRef.current.srcObject);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setTranscript('');
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      mediaRecorderRef.current.onstop = () => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = transcript;
        setAnswers(updatedAnswers);
      };
    }
  };

  // Navigation
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateFeedback();
    }
  };

  // Feedback generation
  const generateFeedback = async () => {
    setProcessingFeedback(true);
    
    try {
      let feedbackData;
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = createFeedbackPrompt(role, experience, skills, description, questions, answers);
        const result = await model.generateContent(prompt);
        feedbackData = processAIResponse(result.response.text());
      } catch (aiError) {
        console.error('AI feedback error:', aiError);
        feedbackData = generateFallbackFeedback(questions, answers);
      }

      await saveInterviewResults({
        role,
        description,
        experience,
        skills,
        questions,
        answers,
        feedback: feedbackData,
        persona,
        duration: Math.floor((Date.now() - interviewStartTime) / 60000)
      });

    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setProcessingFeedback(false);
    }
  };

  // Helper functions
  const parseAIQuestions = (responseText, count) => {
    try {
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']') + 1;
      const jsonString = jsonStart >= 0 ? responseText.slice(jsonStart, jsonEnd) : responseText;
      return JSON.parse(jsonString).slice(0, count);
    } catch {
      return getFallbackQuestions(role, skills, count);
    }
  };

  const getFallbackQuestions = (role, skills, count) => {
    return [
      `Tell me about your experience with ${role}`,
      `What are your strengths with ${skills}`,
      `Describe a challenge you faced in this field`,
      `Where do you see yourself in 5 years?`,
      `Why are you interested in this position?`
    ].slice(0, count);
  };

  const createFeedbackPrompt = (role, experience, skills, description, questions, answers) => {
    return `Analyze this interview for ${role} position...`;
  };

  const processAIResponse = (responseText) => {
    try {
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonString = jsonStart >= 0 ? responseText.slice(jsonStart, jsonEnd) : responseText;
      return JSON.parse(jsonString.replace(/```json|```/g, '').trim());
    } catch {
      return generateFallbackFeedback(questions, answers);
    }
  };

  const generateFallbackFeedback = () => ({
    questionFeedback: questions.map((q, i) => ({
      question: q,
      answer: answers[i] || "No answer",
      feedback: "Standard feedback",
      score: 70
    })),
    overallFeedback: {
      strengths: ["Good effort"],
      improvements: ["More practice needed"],
      overallScore: 70
    }
  });

  const saveInterviewResults = async (data) => {
    try {
      console.log('Attempting to save interview results:', data);
      
      const response = await fetch('/api/interviews/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      // First check if response exists at all
      if (!response) {
        throw new Error('No response from server');
      }

      let result;
      try {
        result = await response.json();
        console.log('Save API response:', result);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid server response format');
      }

      if (!response.ok) {
        console.error('Server error response:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error
        });
        throw new Error(result.error || `Save failed (HTTP ${response.status})`);
      }

      if (!result.interviewId) {
        console.error('Missing interviewId in response:', result);
        throw new Error('Invalid response format - missing interviewId');
      }

      router.push(`/interview/results?id=${result.interviewId}`);
    } catch (error) {
      console.error('Save failed:', {
        error: error.message,
        data: JSON.stringify(data, null, 2)
      });
      alert('Interview completed but could not save. Check dashboard later.');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{role} Interview</h1>
          <p className="text-lg text-gray-600">
            Interviewer: {personaData[persona]?.name || 'Interviewer'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">
              <img 
                src={personaData[persona]?.imageSrc || '/images/default-persona.jpg'} 
                alt="Interviewer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-md text-white">
                {personaData[persona]?.name || 'Interviewer'}
              </div>
            </div>
              
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

          <div className="p-6 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <p className="text-xl mt-2">{questions[currentQuestionIndex]}</p>
            </div>
              
            <div className="space-y-6">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording || processingFeedback}
                  className={`px-6 py-3 rounded-lg ${isRecording || processingFeedback ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white font-medium flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </button>
                  
                <button
                  onClick={stopRecording}
                  disabled={!isRecording || processingFeedback}
                  className={`px-6 py-3 rounded-lg ${!isRecording || processingFeedback ? 'bg-gray-400' : 'bg-gray-700 hover:bg-gray-800'} text-white font-medium flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Recording
                </button>
              </div>
                
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
                
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => router.back()}
                  disabled={processingFeedback}
                  className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium ${processingFeedback ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  Exit Interview
                </button>
                  
                <button
                  onClick={handleNext}
                  disabled={(!answers[currentQuestionIndex] && !transcript) || processingFeedback}
                  className={`px-6 py-2 rounded-lg ${(!answers[currentQuestionIndex] && !transcript) || processingFeedback ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium`}
                >
                  {processingFeedback ? 'Processing...' : currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </button>
              </div>
            </div>
          </div>
        </div>

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