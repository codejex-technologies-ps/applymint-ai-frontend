import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { InterviewSession, InterviewSetupData } from '@/types';

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

    // For now, return mock data
    // In a real implementation, this would fetch from database
    const mockSessions: InterviewSession[] = [
      {
        id: 'session_1',
        userId: user.id,
        title: 'Frontend Developer Interview',
        mode: 'text',
        status: 'completed',
        jobRole: 'Frontend Developer',
        company: 'Tech Corp',
        difficulty: 'mid',
        duration: 45,
        currentQuestionIndex: 5,
        totalQuestions: 5,
        startedAt: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
        completedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        createdAt: new Date(Date.now() - 2700000).toISOString(),
        updatedAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 'session_2',
        userId: user.id,
        title: 'Backend Engineer Interview',
        mode: 'voice',
        status: 'active',
        jobRole: 'Backend Engineer',
        difficulty: 'senior',
        duration: 60,
        currentQuestionIndex: 2,
        totalQuestions: 8,
        startedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 60000).toISOString(),
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockSessions
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

    // Create new interview session
    const newSession: InterviewSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      title: setupData.title,
      mode: setupData.mode,
      status: 'pending',
      jobRole: setupData.jobRole,
      company: setupData.company,
      difficulty: setupData.difficulty || 'mid',
      duration: setupData.duration || 30,
      currentQuestionIndex: 0,
      totalQuestions: setupData.questionTypes?.length || 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In real implementation, save to database here
    console.log('Created new interview session:', newSession);

    return NextResponse.json({
      success: true,
      data: newSession
    });
  } catch (error) {
    console.error('Error creating interview session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}