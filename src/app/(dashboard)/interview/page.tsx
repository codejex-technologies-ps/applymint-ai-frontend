'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InterviewSetupDialog } from '@/components/interview/interview-setup-dialog';
import {
  Brain,
  Mic,
  MessageSquare,
  Clock,
  TrendingUp,
  Play,
  Plus,
  History,
  Award,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Pause,
} from 'lucide-react';
import { InterviewSession, InterviewSetupData } from '@/types';

export default function InterviewPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/interview/sessions');
      const result = await response.json();
      
      if (result.success) {
        setSessions(result.data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async (setupData: InterviewSetupData) => {
    setIsCreatingSession(true);
    
    try {
      const response = await fetch('/api/interview/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupData),
      });

      const result = await response.json();
      
      if (result.success) {
        const newSession = result.data;
        setSessions(prev => [newSession, ...prev]);
        
        // Navigate to interview interface
        router.push(`/interview/${newSession.id}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const getStatusColor = (status: InterviewSession['status']) => {
    switch (status) {
      case 'active':
        return 'bg-chart-2 text-chart-2';
      case 'paused':
        return 'bg-chart-4 text-chart-4';
      case 'completed':
        return 'bg-chart-1 text-chart-1';
      case 'cancelled':
        return 'bg-destructive text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: InterviewSession['status']) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />;
      case 'paused':
        return <Pause className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const mockStats = {
    totalSessions: sessions.length,
    averageScore: 7.8,
    totalHours: 12.5,
    completionRate: 85,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">AI Interview Simulator</h1>
          <p className="text-muted-foreground">
            Practice interviews with AI-powered feedback and improve your skills
          </p>
        </div>
        
        <InterviewSetupDialog
          onSetupComplete={handleCreateSession}
          isLoading={isCreatingSession}
        >
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Start New Interview</span>
          </Button>
        </InterviewSetupDialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.averageScore}/10</div>
            <p className="text-xs text-muted-foreground">
              +0.5 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              +3.2h from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Text Interview</span>
            </CardTitle>
            <CardDescription>
              Practice with text-based conversations. Perfect for detailed responses and thoughtful communication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewSetupDialog
              onSetupComplete={handleCreateSession}
              isLoading={isCreatingSession}
            >
              <Button variant="outline" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Quick Start Text Interview
              </Button>
            </InterviewSetupDialog>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-chart-2/30 hover:border-chart-2/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-chart-2" />
              <span>Voice Interview</span>
              <Badge variant="outline" className="text-xs">Beta</Badge>
            </CardTitle>
            <CardDescription>
              Practice with voice conversations using Gemini Live. Great for improving verbal communication skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewSetupDialog
              onSetupComplete={handleCreateSession}
              isLoading={isCreatingSession}
            >
              <Button variant="outline" className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Quick Start Voice Interview
              </Button>
            </InterviewSetupDialog>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recent Interview Sessions</span>
          </CardTitle>
          <CardDescription>
            Your latest interview practice sessions and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">No interviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first AI interview to begin practicing and improving your skills.
              </p>
              <InterviewSetupDialog
                onSetupComplete={handleCreateSession}
                isLoading={isCreatingSession}
              >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Your First Interview
                </Button>
              </InterviewSetupDialog>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {session.mode === 'voice' ? (
                        <Mic className="h-4 w-4 text-chart-2" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-primary" />
                      )}
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(session.status)} text-xs`}
                      >
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-medium text-primary">{session.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{session.jobRole}</span>
                        {session.company && <span>• {session.company}</span>}
                        <span>• {session.difficulty} level</span>
                        <span>• {formatDuration(session.duration)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">
                        {session.completedAt
                          ? `Completed ${new Date(session.completedAt).toLocaleDateString()}`
                          : session.startedAt
                          ? `Started ${new Date(session.startedAt).toLocaleDateString()}`
                          : `Created ${new Date(session.createdAt).toLocaleDateString()}`}
                      </div>
                      <div className="text-primary font-medium">
                        {session.currentQuestionIndex}/{session.totalQuestions} questions
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {session.status === 'active' || session.status === 'paused' ? (
                        <Button
                          size="sm"
                          onClick={() => router.push(`/interview/${session.id}`)}
                        >
                          {session.status === 'paused' ? 'Resume' : 'Continue'}
                        </Button>
                      ) : session.status === 'completed' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/interview/${session.id}/summary`)}
                        >
                          View Results
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/interview/${session.id}`)}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips and Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-chart-2" />
              <span>Interview Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Practice the STAR method</p>
                <p className="text-muted-foreground">Structure behavioral answers with Situation, Task, Action, Result</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Think out loud</p>
                <p className="text-muted-foreground">Explain your thought process, especially for technical questions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-chart-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Ask clarifying questions</p>
                <p className="text-muted-foreground">Don&apos;t hesitate to ask for clarification on requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Zap className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Instant Feedback</p>
                <p className="text-muted-foreground">Get immediate analysis of your answers with detailed scoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Adaptive Questions</p>
                <p className="text-muted-foreground">Questions adjust to your experience level and performance</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Performance Tracking</p>
                <p className="text-muted-foreground">Monitor your progress and identify areas for improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}