import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return new Response('Session ID required', { status: 400 });
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
          // No-op for SSE
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Create Server-Sent Events stream
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: 'connected',
        sessionId,
        timestamp: new Date().toISOString()
      })}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      // Set up heartbeat interval
      const heartbeatInterval = setInterval(() => {
        const heartbeat = `data: ${JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        })}\n\n`;
        controller.enqueue(encoder.encode(heartbeat));
      }, 30000); // Send heartbeat every 30 seconds

      // Store cleanup function
      (controller as { cleanup?: () => void }).cleanup = () => {
        clearInterval(heartbeatInterval);
      };

      // Handle mock interview flow
      setTimeout(() => {
        // Send first question after 2 seconds
        const questionMessage = `data: ${JSON.stringify({
          type: 'question_generated',
          payload: {
            question: {
              id: `q_${Date.now()}`,
              sessionId,
              type: 'technical',
              question: "Tell me about your experience with React and how you handle state management in complex applications.",
              context: "This question assesses your practical experience with React and understanding of state management patterns.",
              expectedAnswerPoints: [
                "Experience with React hooks",
                "State management solutions (Redux, Zustand, Context API)",
                "Performance optimization techniques",
                "Component architecture patterns"
              ],
              difficulty: 'mid',
              timeLimit: 300,
              order: 1
            }
          },
          timestamp: new Date().toISOString()
        })}\n\n`;
        controller.enqueue(encoder.encode(questionMessage));
      }, 2000);
    },

    cancel() {
      // Clean up when stream is cancelled
      const self = this as { cleanup?: () => void };
      if (self.cleanup) {
        self.cleanup();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
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
            // No-op for POST
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { type, payload, sessionId } = await request.json();

    // Handle different message types
    switch (type) {
      case 'answer_submitted':
        // Process answer and generate feedback
        const feedback = {
          id: `f_${Date.now()}`,
          answerId: payload.answerId,
          questionId: payload.questionId,
          sessionId,
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
          ],
          createdAt: new Date().toISOString()
        };
        feedback.overallScore = Math.round(
          (feedback.communicationScore + feedback.technicalScore + feedback.completenessScore) / 3
        );

        return new Response(JSON.stringify({
          success: true,
          data: { feedback }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'session_end':
        // Generate session summary
        const summary = {
          sessionId,
          overallScore: 7.5,
          totalQuestions: 5,
          answeredQuestions: 5,
          averageResponseTime: 120,
          communicationAvg: 8.2,
          technicalAvg: 7.1,
          completenessAvg: 6.8,
          technicalQuestions: { answered: 3, avgScore: 7.3 },
          behavioralQuestions: { answered: 2, avgScore: 7.8 },
          situationalQuestions: { answered: 0, avgScore: 0 },
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

        return new Response(JSON.stringify({
          success: true,
          data: { summary }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({
          success: true,
          data: { message: 'Message received' }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error handling interview stream message:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}