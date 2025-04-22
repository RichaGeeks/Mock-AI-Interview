import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';

export async function GET(request) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Connect DB
    await dbConnect();

    // 3. Get interview ID from query params
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('id');
    
    if (!interviewId) {
      return NextResponse.json(
        { error: 'Interview ID required' },
        { status: 400 }
      );
    }

    // 4. Find interview (only accessible to the owner)
    const interview = await Interview.findOne({
      _id: interviewId,
      userId: session.user.id
    }).lean();

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // 5. Return interview data
    return NextResponse.json(interview);

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}