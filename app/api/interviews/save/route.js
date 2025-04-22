import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';

export async function POST(request) {
  console.log('[Interview Save] Request received');
  
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    console.log('[Interview Save] Session data:', session ? 'exists' : 'missing');
    
    if (!session?.user?.id) {
      console.warn('[Interview Save] Unauthorized access attempt');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('[Interview Save] User ID:', session.user.id);

    // Data Validation
    let body;
    try {
      body = await request.json();
      console.log('[Interview Save] Request body received');
      
      if (!body || !body.questions || !body.feedback) {
        console.warn('[Interview Save] Invalid body structure:', {
          hasQuestions: !!body?.questions,
          hasFeedback: !!body?.feedback
        });
        return NextResponse.json(
          { success: false, message: 'Invalid interview data' },
          { status: 400 }
        );
      }
    } catch (e) {
      console.error('[Interview Save] JSON parse error:', e);
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Database Connection
    await dbConnect();
    console.log('[Interview Save] Database connected');

    try {
      const interviewData = {
        userId: session.user.id,
        role: body.role || 'Unknown Position',
        description: body.description || '',
        experience: body.experience || '',
        skills: Array.isArray(body.skills) ? body.skills : [],
        questions: body.questions,
        answers: Array.isArray(body.answers) ? body.answers : [],
        feedback: body.feedback,
        persona: body.persona || 'neutral',
        overallScore: body.feedback?.overallFeedback?.overallScore || 0,
        duration: body.duration || 0
      };

      console.log('[Interview Save] Attempting to create interview');
      const interview = await Interview.create(interviewData);
      
      console.log(`[Interview Save] Success for user ${session.user.id}`);
      return NextResponse.json(
        { 
          success: true, 
          interviewId: interview._id,
          message: 'Interview saved successfully'
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('[Interview Save] Database error:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to save to database',
          error: dbError.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[Interview Save] Server error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}