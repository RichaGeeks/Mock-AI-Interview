import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Interview from '@/models/Interview';
import connectDB from '@/lib/db';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const interviews = await Interview.find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(10);

    return new Response(JSON.stringify(interviews), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}