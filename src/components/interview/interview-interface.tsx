'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Send,
  Mic,
  Pause,
  Play,
  Square,
  Clock,
  MessageSquare,
  Brain,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Download,
  RotateCcw,
} from 'lucide-react';
import { InterviewSession, InterviewQuestion, InterviewAnswer, InterviewFeedback, InterviewSessionSummary } from '@/types';

interface InterviewInterfaceProps {
  session: InterviewSession;
  onSessionUpdate: (session: InterviewSession) => void;
  onSessionEnd: (summary: InterviewSessionSummary) => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
  question?: InterviewQuestion;
  feedback?: InterviewFeedback;
}

export function InterviewInterface({ session, onSessionUpdate, onSessionEnd }: InterviewInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(session.duration * 60); // Convert to seconds
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [isWaitingForFeedback, setIsWaitingForFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<InterviewSessionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleStreamMessage = useCallback((data: {
    type: string;
    payload?: { question?: InterviewQuestion };
    sessionId?: string;
    timestamp: string;
  }) => {
    switch (data.type) {
      case 'connected':
        addMessage({
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: `Hello! I&apos;m your AI interviewer. I&apos;ll be conducting a ${session.difficulty} level interview for the ${session.jobRole} position${session.company ? ` at ${session.company}` : ''}. Let&apos;s begin!`,
          timestamp: new Date().toISOString(),
        });
        break;

      case 'question_generated':
        if (data.payload?.question) {
          const question: InterviewQuestion = data.payload.question;
          setCurrentQuestion(question);
          addMessage({
            id: `msg_${Date.now()}`,
            type: 'ai',
            content: question.question,
            timestamp: new Date().toISOString(),
            question,
          });
        }
        break;

      default:
        break;
    }
  }, [session]);

  const startInterviewSession = useCallback(async () => {
    // Connect to Server-Sent Events stream
    eventSourceRef.current = new EventSource(`/api/interview/stream?sessionId=${session.id}`);
    
    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleStreamMessage(data);
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    // Update session status to active
    const updatedSession = { ...session, status: 'active' as const, startedAt: new Date().toISOString() };
    onSessionUpdate(updatedSession);
  }, [session, onSessionUpdate, handleStreamMessage]);

  const handleEndSession = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/interview/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'session_end',
          payload: {},
          sessionId: session.id,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data.summary) {
        setSessionSummary(result.data.summary);
        setShowSummary(true);
        
        const updatedSession = {
          ...session,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
        };
        onSessionUpdate(updatedSession);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsLoading(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }
  }, [session, onSessionUpdate]);

  useEffect(() => {
    startInterviewSession();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [startInterviewSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (session.status === 'active' && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session.status, isPaused, handleEndSession]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || !currentQuestion) return;

    setIsLoading(true);
    setIsWaitingForFeedback(true);

    // Add user message
    addMessage({
      id: `msg_${Date.now()}`,
      type: 'user',
      content: currentAnswer,
      timestamp: new Date().toISOString(),
    });

    const answer: InterviewAnswer = {
      id: `a_${Date.now()}`,
      questionId: currentQuestion.id,
      sessionId: session.id,
      answer: currentAnswer,
      duration: 0, // Would be calculated in real implementation
      submittedAt: new Date().toISOString(),
    };

    try {
      // Submit answer for feedback
      const response = await fetch('/api/interview/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'answer_submitted',
          payload: {
            answerId: answer.id,
            questionId: currentQuestion.id,
            answer: currentAnswer,
          },
          sessionId: session.id,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data.feedback) {
        const feedback: InterviewFeedback = result.data.feedback;
        
        // Add feedback message
        addMessage({
          id: `msg_${Date.now()}`,
          type: 'ai',
          content: generateFeedbackMessage(feedback),
          timestamp: new Date().toISOString(),
          feedback,
        });

        // Generate next question or end session
        if (session.currentQuestionIndex < session.totalQuestions - 1) {
          setTimeout(() => {
            generateNextQuestion();
          }, 2000);
        } else {
          setTimeout(() => {
            handleEndSession();
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      addMessage({
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: "I apologize, but I&apos;m having trouble processing your answer. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setCurrentAnswer('');
      setIsLoading(false);
      setIsWaitingForFeedback(false);
    }
  };

  const generateFeedbackMessage = (feedback: InterviewFeedback): string => {
    return `Great answer! Here's your feedback:

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
  };

  const generateNextQuestion = () => {
    // In real implementation, this would request the next question from the API
    const mockQuestions = [
      "Can you walk me through how you would approach debugging a performance issue in a web application?",
      "Tell me about a challenging technical problem you solved recently. What was your approach?",
      "How do you stay updated with the latest technologies and industry trends?",
      "Describe a situation where you had to work with a difficult team member. How did you handle it?",
      "What would you do if you disagreed with a technical decision made by your team lead?",
    ];

    const nextQuestion: InterviewQuestion = {
      id: `q_${Date.now()}`,
      sessionId: session.id,
      type: 'technical',
      question: mockQuestions[session.currentQuestionIndex + 1] || mockQuestions[0],
      difficulty: session.difficulty,
      order: session.currentQuestionIndex + 1,
    };

    setCurrentQuestion(nextQuestion);
    addMessage({
      id: `msg_${Date.now()}`,
      type: 'ai',
      content: nextQuestion.question,
      timestamp: new Date().toISOString(),
      question: nextQuestion,
    });

    // Update session
    const updatedSession = {
      ...session,
      currentQuestionIndex: session.currentQuestionIndex + 1,
    };
    onSessionUpdate(updatedSession);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    const updatedSession = {
      ...session,
      status: isPaused ? 'active' as const : 'paused' as const,
    };
    onSessionUpdate(updatedSession);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((session.duration * 60 - timeRemaining) / (session.duration * 60)) * 100;

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="font-semibold text-lg">{session.title}</h1>
              <p className="text-sm text-muted-foreground">
                {session.jobRole} • {session.company} • {session.difficulty} level
              </p>
            </div>
            <Badge variant={session.mode === 'voice' ? 'default' : 'secondary'}>
              {session.mode === 'voice' ? (
                <Mic className="h-3 w-3 mr-1" />
              ) : (
                <MessageSquare className="h-3 w-3 mr-1" />
              )}
              {session.mode === 'voice' ? 'Voice' : 'Text'}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining < 300 ? 'text-destructive font-medium' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Progress value={progress} className="w-24" />

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseResume}
                disabled={session.status === 'completed'}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleEndSession}
                disabled={session.status === 'completed' || isLoading}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Interviewer</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{message.content}</div>

                {message.feedback && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-4 w-4 text-chart-2" />
                      <span className="text-sm font-medium text-chart-2">Feedback</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-chart-2" />
                        <span>Score: {message.feedback.overallScore}/10</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isWaitingForFeedback && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4 mr-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing your answer...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {session.status === 'active' && !isPaused && (
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading || isWaitingForFeedback}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isLoading || isWaitingForFeedback}
                size="lg"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        )}
      </div>

      {/* Session Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-chart-2" />
              <span>Interview Complete!</span>
            </DialogTitle>
            <DialogDescription>
              Here&apos;s your performance summary and recommendations.
            </DialogDescription>
          </DialogHeader>

          {sessionSummary && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {sessionSummary.overallScore}/10
                </div>
                <p className="text-muted-foreground">Overall Performance</p>
              </div>

              <Tabs defaultValue="scores" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scores">Scores</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
                </TabsList>

                <TabsContent value="scores" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Communication</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {sessionSummary.communicationAvg.toFixed(1)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Technical</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {sessionSummary.technicalAvg.toFixed(1)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completeness</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {sessionSummary.completenessAvg.toFixed(1)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm text-chart-2">Top Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {sessionSummary.topStrengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-3 w-3 text-chart-2 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm text-chart-4">Areas for Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {sessionSummary.areasForImprovement.map((area, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <AlertCircle className="h-3 w-3 text-chart-4 mt-0.5 flex-shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="next-steps" className="space-y-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Recommended Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {sessionSummary.recommendedResources.map((resource, index) => (
                            <li key={index}>• {resource}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {sessionSummary.nextSteps.map((step, index) => (
                            <li key={index}>• {step}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    setShowSummary(false);
                    if (sessionSummary) {
                      onSessionEnd(sessionSummary);
                    }
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start New Interview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}