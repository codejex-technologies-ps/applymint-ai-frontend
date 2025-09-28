import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { InterviewSetupData } from '@/types';
import { interviewService } from '@/lib/services/interview-service';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if we can't set cookies
            }
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch sessions from database
    const sessions = await interviewService.getUserSessions(user.id);
    
    // Transform database sessions to match frontend interface
    const transformedSessions = sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      title: session.title,
      mode: session.mode,
      status: session.status,
      jobRole: session.jobRole,
      company: session.company,
      difficulty: session.difficulty,
      duration: session.duration,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.totalQuestions,
      startedAt: session.startedAt?.toISOString(),
      completedAt: session.completedAt?.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: transformedSessions
    });
  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if we can't set cookies
            }
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const setupData: InterviewSetupData = await request.json();

    // Validate required fields
    if (!setupData.title || !setupData.jobRole || !setupData.mode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new interview session in database
    const sessionData = {
      userId: user.id,
      title: setupData.title,
      mode: setupData.mode,
      status: 'pending' as const,
      jobRole: setupData.jobRole,
      company: setupData.company,
      difficulty: setupData.difficulty || 'mid' as const,
      duration: setupData.duration || 30,
      totalQuestions: setupData.questionTypes?.length || 5,
      currentQuestionIndex: 0,
      customInstructions: setupData.customInstructions,
      questionTypes: setupData.questionTypes ? JSON.stringify(setupData.questionTypes) : undefined,
    };

    const newSession = await interviewService.createSession(sessionData);

    // Transform database session to match frontend interface
    const transformedSession = {
      id: newSession.id,
      userId: newSession.userId,
      title: newSession.title,
      mode: newSession.mode,
      status: newSession.status,
      jobRole: newSession.jobRole,
      company: newSession.company,
      difficulty: newSession.difficulty,
      duration: newSession.duration,
      currentQuestionIndex: newSession.currentQuestionIndex,
      totalQuestions: newSession.totalQuestions,
      startedAt: newSession.startedAt?.toISOString(),
      completedAt: newSession.completedAt?.toISOString(),
      createdAt: newSession.createdAt.toISOString(),
      updatedAt: newSession.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedSession
    });
  } catch (error) {
    console.error('Error creating interview session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}