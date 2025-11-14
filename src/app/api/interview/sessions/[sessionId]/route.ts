import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { interviewService } from '@/lib/services/interview-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
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

    // Get session with conversation data
    const conversation = await interviewService.getSessionConversation(sessionId);
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify user owns this session
    if (conversation.session.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Transform database data to match frontend interface
    const transformedSession = {
      id: conversation.session.id,
      userId: conversation.session.userId,
      title: conversation.session.title,
      mode: conversation.session.mode,
      status: conversation.session.status,
      jobRole: conversation.session.jobRole,
      company: conversation.session.company,
      difficulty: conversation.session.difficulty,
      duration: conversation.session.duration,
      currentQuestionIndex: conversation.session.currentQuestionIndex,
      totalQuestions: conversation.session.totalQuestions,
      startedAt: conversation.session.startedAt?.toISOString(),
      completedAt: conversation.session.completedAt?.toISOString(),
      createdAt: conversation.session.createdAt.toISOString(),
      updatedAt: conversation.session.updatedAt.toISOString(),
    };

    const transformedMessages = conversation.messages.map(message => ({
      id: message.id,
      type: message.type,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      questionId: message.questionId,
      audioUrl: message.audioUrl,
      transcription: message.transcription,
    }));

    const transformedQuestions = conversation.questions.map(question => ({
      id: question.id,
      sessionId: question.sessionId,
      type: question.type,
      question: question.question,
      context: question.context,
      expectedAnswerPoints: question.expectedAnswerPoints,
      difficulty: question.difficulty,
      timeLimit: question.timeLimit,
      order: question.order,
      askedAt: question.askedAt?.toISOString(),
      answeredAt: question.answeredAt?.toISOString(),
    }));

    const transformedResponses = conversation.responses.map(response => ({
      id: response.id,
      questionId: response.questionId,
      answer: response.answer,
      audioUrl: response.audioUrl,
      transcription: response.transcription,
      duration: response.duration,
      communicationScore: response.communicationScore,
      technicalScore: response.technicalScore,
      completenessScore: response.completenessScore,
      overallScore: response.overallScore,
      strengths: response.strengths,
      weaknesses: response.weaknesses,
      suggestions: response.suggestions,
      improvedAnswer: response.improvedAnswer,
      submittedAt: response.submittedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        session: transformedSession,
        messages: transformedMessages,
        questions: transformedQuestions,
        responses: transformedResponses,
      }
    });
  } catch (error) {
    console.error('Error fetching session conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
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

    const updates = await request.json();

    // Verify user owns this session
    const session = await interviewService.getSessionById(sessionId);
    if (!session || session.userId !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // Update session
    const updatedSession = await interviewService.updateSession(sessionId, updates);
    
    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    // Transform response
    const transformedSession = {
      id: updatedSession.id,
      userId: updatedSession.userId,
      title: updatedSession.title,
      mode: updatedSession.mode,
      status: updatedSession.status,
      jobRole: updatedSession.jobRole,
      company: updatedSession.company,
      difficulty: updatedSession.difficulty,
      duration: updatedSession.duration,
      currentQuestionIndex: updatedSession.currentQuestionIndex,
      totalQuestions: updatedSession.totalQuestions,
      startedAt: updatedSession.startedAt?.toISOString(),
      completedAt: updatedSession.completedAt?.toISOString(),
      createdAt: updatedSession.createdAt.toISOString(),
      updatedAt: updatedSession.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedSession
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}