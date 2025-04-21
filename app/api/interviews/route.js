
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await dbConnect();

  try {
    const interviews = await Interview.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(interviews);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}