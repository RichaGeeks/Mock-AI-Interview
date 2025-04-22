// app/dashboard/page.js
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiPlus, FiTrendingUp, FiBarChart2, FiCalendar, FiAward } from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    lastScore: 0
  });

  useEffect(() => {
    async function loadInterviews() {
      try {
        const res = await fetch('/api/interviews');
        if (res.ok) {
          const data = await res.json();
          setInterviews(data);
          
          // Calculate stats
          const total = data.length;
          const avgScore = total > 0 
            ? Math.round(data.reduce((sum, i) => sum + i.feedback.overallFeedback.overallScore, 0) / total)
            : 0;
          const lastScore = total > 0 ? data[0].feedback.overallFeedback.overallScore : 0;
          
          setStats({
            totalInterviews: total,
            averageScore: avgScore,
            lastScore: lastScore
          });
        }
      } catch (error) {
        console.error('Failed to load interviews:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) loadInterviews();
  }, [session]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {session?.user?.name?.charAt(0)}
              </div>
              <span className="text-gray-700">{session?.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {session?.user?.name?.split(' ')[0]}!</h2>
              <p className="opacity-90">Ready for your next interview practice session?</p>
            </div>
            <Link
              href="/interview/setup"
              className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus className="mr-2" />
              New Interview
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Interviews</p>
                <p className="text-3xl font-bold mt-1">{stats.totalInterviews}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FiBarChart2 size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className={`text-3xl font-bold mt-1 ${
                  stats.averageScore >= 80 ? 'text-green-600' : 
                  stats.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.averageScore}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <FiTrendingUp size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Last Score</p>
                <p className={`text-3xl font-bold mt-1 ${
                  stats.lastScore >= 80 ? 'text-green-600' : 
                  stats.lastScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.lastScore}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <FiAward size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-3xl font-bold mt-1">
                  {interviews.filter(i => {
                    const interviewDate = new Date(i.createdAt);
                    const now = new Date();
                    return interviewDate.getMonth() === now.getMonth() && 
                           interviewDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                <FiCalendar size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Interviews</h2>
            {interviews.length > 0 && (
              <Link href="/dashboard/history" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            )}
          </div>

          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No interviews yet. Start your first mock interview!</p>
              <Link
                href="/interview/setup"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiPlus className="mr-2" />
                New Interview
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback Summary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interviews.slice(0, 5).map((interview) => (
                    <tr key={interview._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {interview.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(interview.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${interview.feedback.overallFeedback.overallScore >= 80 ? 'bg-green-100 text-green-800' : 
                            interview.feedback.overallFeedback.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {interview.feedback.overallFeedback.overallScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {interview.feedback.overallFeedback.strengths[0]}... 
                        <span className="text-blue-600 hover:underline ml-2 cursor-pointer" 
                          onClick={() => alert(interview.feedback.overallFeedback.strengths.join('\n'))}>
                          (view more)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/interview/results?id=${interview._id}`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Trends</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            {interviews.length > 1 ? (
              <p className="text-gray-500">Chart showing your progress over time</p>
            ) : (
              <p className="text-gray-500">Complete more interviews to see your trends</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}