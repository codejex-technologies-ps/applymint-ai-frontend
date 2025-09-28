import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { WebSocket } from 'ws';
import { interviewService } from '@/lib/services/interview-service';
import { WebSocketMessage } from '@/types';

interface ExtendedWebSocket extends WebSocket {
  sessionId?: string;
  userId?: string;
  isAlive?: boolean;
}

// In-memory store for WebSocket connections
const connections = new Map<string, ExtendedWebSocket>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  // Check if the request can be upgraded to WebSocket
  const upgradeHeader = request.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return NextResponse.json({ error: 'Expected WebSocket upgrade' }, { status: 426 });
  }

  // Verify authentication
  const cookieHeader = request.headers.get('cookie') || '';
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieHeader.split('; ').map(cookie => {
            const [name, value] = cookie.split('=');
            return { name, value };
          }).filter(cookie => cookie.name && cookie.value);
        },
        setAll() {
          // No-op for WebSocket
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Create WebSocket connection (this is a conceptual implementation)
    // In a real implementation, you would use a WebSocket server
    const ws = new WebSocket('ws://placeholder') as ExtendedWebSocket;
    
    ws.sessionId = sessionId;
    ws.userId = user.id;
    ws.isAlive = true;

    // Store connection
    connections.set(sessionId, ws);

    // Set up WebSocket event handlers
    ws.on('open', () => {
      console.log(`WebSocket connection opened for session: ${sessionId}`);
      
      // Send connection confirmation
      const message: WebSocketMessage = {
        type: 'session_start',
        payload: { sessionId, userId: user.id },
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      ws.send(JSON.stringify(message));
    });

    ws.on('message', async (data: Buffer) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        await handleWebSocketMessage(message, ws, user.id);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed for session: ${sessionId}`);
      connections.delete(sessionId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for session ${sessionId}:`, error);
      connections.delete(sessionId);
    });

    // Heartbeat mechanism
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    return NextResponse.json({ message: 'WebSocket connection established' });
  } catch (error) {
    console.error('Error creating WebSocket connection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleWebSocketMessage(
  message: WebSocketMessage,
  ws: ExtendedWebSocket,
  userId: string
) {
  const { type, payload, sessionId } = message;

  if (!sessionId) {
    sendError(ws, 'Session ID required');
    return;
  }

  try {
    switch (type) {
      case 'heartbeat':
        ws.send(JSON.stringify({
          type: 'heartbeat',
          payload: { status: 'alive' },
          timestamp: new Date().toISOString(),
          sessionId
        }));
        break;

      case 'start_session':
        await handleStartSession(payload, ws, sessionId, userId);
        break;

      case 'generate_question':
        await handleGenerateQuestion(payload, ws, sessionId);
        break;

      case 'submit_answer':
        await handleSubmitAnswer(payload, ws, sessionId, userId);
        break;

      case 'end_session':
        await handleEndSession(payload, ws, sessionId);
        break;

      default:
        console.warn(`Unknown message type: ${type}`);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendError(ws, 'Failed to process message');
  }
}

async function handleStartSession(
  payload: Record<string, unknown>,
  ws: ExtendedWebSocket,
  sessionId: string,
  userId: string
) {
  try {
    // Update session status to active
    const session = await interviewService.updateSession(sessionId, {
      status: 'active',
      startedAt: new Date(),
    });

    if (!session) {
      sendError(ws, 'Session not found');
      return;
    }

    // Create welcome message
    const messageIndex = await getNextMessageIndex(sessionId);
    await interviewService.createMessage({
      sessionId,
      type: 'ai',
      content: `Hello! I'm your AI interviewer. I'll be conducting a ${session.difficulty} level interview for the ${session.jobRole} position${session.company ? ` at ${session.company}` : ''}. Let's begin!`,
      messageIndex,
    });

    // Send response
    ws.send(JSON.stringify({
      type: 'session_started',
      payload: { session },
      timestamp: new Date().toISOString(),
      sessionId
    }));

    // Generate first question
    setTimeout(() => {
      handleGenerateQuestion({}, ws, sessionId);
    }, 2000);
  } catch (error) {
    console.error('Error starting session:', error);
    sendError(ws, 'Failed to start session');
  }
}

async function handleGenerateQuestion(
  payload: Record<string, unknown>,
  ws: ExtendedWebSocket,
  sessionId: string
) {
  try {
    const session = await interviewService.getSessionById(sessionId);
    if (!session) {
      sendError(ws, 'Session not found');
      return;
    }

    // Get existing questions to determine order
    const existingQuestions = await interviewService.getSessionQuestions(sessionId);
    const nextOrder = existingQuestions.length + 1;

    if (nextOrder > session.totalQuestions) {
      // End session if we've reached the limit
      await handleEndSession({}, ws, sessionId);
      return;
    }

    // Generate a question (mock implementation)
    const mockQuestions = [
      "Tell me about your experience with React and how you handle state management in complex applications.",
      "Can you walk me through how you would approach debugging a performance issue in a web application?",
      "Describe a challenging technical problem you solved recently. What was your approach?",
      "How do you stay updated with the latest technologies and industry trends?",
      "Tell me about a time when you had to work with a difficult team member. How did you handle it?"
    ];

    const question = await interviewService.createQuestion({
      sessionId,
      question: mockQuestions[(nextOrder - 1) % mockQuestions.length],
      type: 'technical',
      difficulty: session.difficulty,
      order: nextOrder,
      askedAt: new Date(),
    });

    // Create question message
    const messageIndex = await getNextMessageIndex(sessionId);
    await interviewService.createMessage({
      sessionId,
      type: 'ai',
      content: question.question,
      questionId: question.id,
      messageIndex,
    });

    // Stream the question response
    await streamMessage(ws, sessionId, question.question, 'question_generated', {
      question
    });

  } catch (error) {
    console.error('Error generating question:', error);
    sendError(ws, 'Failed to generate question');
  }
}

async function handleSubmitAnswer(
  payload: Record<string, unknown>,
  ws: ExtendedWebSocket,
  sessionId: string,
  userId: string
) {
  try {
    const { questionId, answer, duration = 0 } = payload;

    if (!questionId || !answer) {
      sendError(ws, 'Question ID and answer are required');
      return;
    }

    // Save user's answer message
    const messageIndex = await getNextMessageIndex(sessionId);
    await interviewService.createMessage({
      sessionId,
      type: 'user',
      content: answer as string,
      questionId: questionId as string,
      messageIndex,
    });

    // Generate mock AI feedback
    const feedback = {
      communicationScore: Math.floor(Math.random() * 3) + 7, // 7-10
      technicalScore: Math.floor(Math.random() * 3) + 6, // 6-9
      completenessScore: Math.floor(Math.random() * 3) + 6, // 6-9
      overallScore: 0,
      strengths: [
        "Clear explanation of concepts",
        "Good use of specific examples",
        "Demonstrates practical experience"
      ],
      weaknesses: [
        "Could provide more technical depth",
        "Consider mentioning edge cases"
      ],
      suggestions: [
        "Practice explaining complex concepts in simpler terms",
        "Include more real-world scenarios in your examples"
      ]
    };

    feedback.overallScore = Math.round(
      (feedback.communicationScore + feedback.technicalScore + feedback.completenessScore) / 3
    );

    // Save response with feedback
    await interviewService.createResponse({
      questionId: questionId as string,
      answer: answer as string,
      duration: duration as number,
      communicationScore: feedback.communicationScore,
      technicalScore: feedback.technicalScore,
      completenessScore: feedback.completenessScore,
      overallScore: feedback.overallScore,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      suggestions: feedback.suggestions,
    });

    // Update question as answered
    await interviewService.updateQuestion(questionId as string, {
      answeredAt: new Date(),
    });

    // Create feedback message
    const feedbackMessageIndex = await getNextMessageIndex(sessionId);
    const feedbackContent = `Great answer! Here's your feedback:

**Scores:**
- Communication: ${feedback.communicationScore}/10
- Technical Accuracy: ${feedback.technicalScore}/10
- Completeness: ${feedback.completenessScore}/10
- Overall: ${feedback.overallScore}/10

**Strengths:**
${feedback.strengths.map(s => `• ${s}`).join('\n')}

**Areas for Improvement:**
${feedback.weaknesses.map(w => `• ${w}`).join('\n')}

**Suggestions:**
${feedback.suggestions.map(s => `• ${s}`).join('\n')}`;

    await interviewService.createMessage({
      sessionId,
      type: 'ai',
      content: feedbackContent,
      messageIndex: feedbackMessageIndex,
    });

    // Stream feedback response
    await streamMessage(ws, sessionId, feedbackContent, 'feedback_generated', {
      feedback
    });

    // Generate next question after a delay
    setTimeout(() => {
      handleGenerateQuestion({}, ws, sessionId);
    }, 3000);

  } catch (error) {
    console.error('Error submitting answer:', error);
    sendError(ws, 'Failed to submit answer');
  }
}

async function handleEndSession(
  payload: Record<string, unknown>,
  ws: ExtendedWebSocket,
  sessionId: string
) {
  try {
    // Update session status
    const session = await interviewService.updateSession(sessionId, {
      status: 'completed',
      completedAt: new Date(),
    });

    if (!session) {
      sendError(ws, 'Session not found');
      return;
    }

    // Get session responses for summary
    const responses = await interviewService.getSessionResponses(sessionId);
    
    // Generate summary
    const summary = {
      sessionId,
      overallScore: responses.length > 0 
        ? responses.reduce((sum, r) => sum + (r.overallScore || 0), 0) / responses.length
        : 0,
      totalQuestions: session.totalQuestions,
      answeredQuestions: responses.length,
      averageResponseTime: responses.length > 0
        ? responses.reduce((sum, r) => sum + (r.duration || 0), 0) / responses.length
        : 0,
      communicationAvg: responses.length > 0
        ? responses.reduce((sum, r) => sum + (r.communicationScore || 0), 0) / responses.length
        : 0,
      technicalAvg: responses.length > 0
        ? responses.reduce((sum, r) => sum + (r.technicalScore || 0), 0) / responses.length
        : 0,
      completenessAvg: responses.length > 0
        ? responses.reduce((sum, r) => sum + (r.completenessScore || 0), 0) / responses.length
        : 0,
      topStrengths: [
        "Excellent communication skills",
        "Strong problem-solving approach",
        "Good use of real-world examples"
      ],
      areasForImprovement: [
        "Technical depth in system design",
        "Edge case handling",
        "Performance optimization knowledge"
      ],
      recommendedResources: [
        "System Design Interview book",
        "LeetCode algorithms practice",
        "React performance optimization guide"
      ],
      nextSteps: [
        "Practice more system design questions",
        "Review database optimization techniques",
        "Work on explaining complex concepts concisely"
      ],
      generatedAt: new Date().toISOString()
    };

    ws.send(JSON.stringify({
      type: 'session_ended',
      payload: { summary },
      timestamp: new Date().toISOString(),
      sessionId
    }));

    // Close connection after sending summary
    setTimeout(() => {
      ws.close();
      connections.delete(sessionId);
    }, 1000);

  } catch (error) {
    console.error('Error ending session:', error);
    sendError(ws, 'Failed to end session');
  }
}

// Helper functions
async function getNextMessageIndex(sessionId: string): Promise<number> {
  const messages = await interviewService.getSessionMessages(sessionId);
  return messages.length;
}

async function streamMessage(
  ws: ExtendedWebSocket,
  sessionId: string,
  content: string,
  type: string,
  additionalPayload: Record<string, unknown> = {}
) {
  // Simulate streaming by sending chunks
  const words = content.split(' ');
  const chunkSize = Math.max(1, Math.floor(words.length / 10)); // 10 chunks
  
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    const isLast = i + chunkSize >= words.length;
    
    ws.send(JSON.stringify({
      type: `${type}_chunk`,
      payload: {
        chunk,
        isLast,
        fullContent: isLast ? content : undefined,
        ...additionalPayload
      },
      timestamp: new Date().toISOString(),
      sessionId
    }));

    // Small delay between chunks
    if (!isLast) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

function sendError(ws: ExtendedWebSocket, message: string) {
  ws.send(JSON.stringify({
    type: 'error',
    payload: { error: message },
    timestamp: new Date().toISOString(),
    sessionId: ws.sessionId
  }));
}

// Heartbeat to keep connections alive
setInterval(() => {
  connections.forEach((ws, sessionId) => {
    if (!ws.isAlive) {
      ws.terminate();
      connections.delete(sessionId);
      return;
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000); // Every 30 seconds