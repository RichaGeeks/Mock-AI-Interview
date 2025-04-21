import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await dbConnect();

  try {
    const { role, questions, answers, feedback, persona } = await req.json();
    
    const interview = await Interview.create({
      userId: session.user.id,
      role,
      questions,
      answers,
      feedback,
      persona,
      overallScore: feedback.overallFeedback.overallScore
    });

    return Response.json({ success: true, interview });
  } catch (error) {
    return Response.json(
      { error: 'Failed to save interview' },
      { status: 500 }
    );
  }
}