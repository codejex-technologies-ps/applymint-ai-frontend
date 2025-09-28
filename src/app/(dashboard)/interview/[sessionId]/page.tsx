'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InterviewInterface } from '@/components/interview/interview-interface';
import { InterviewSession } from '@/types';

export default function InterviewSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch('/api/interview/sessions');
      const result = await response.json();
      
      if (result.success) {
        const foundSession = result.data.find((s: InterviewSession) => s.id === sessionId);
        if (foundSession) {
          setSession(foundSession);
        } else {
          setError('Interview session not found');
        }
      } else {
        setError('Failed to load interview session');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setError('Failed to load interview session');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, fetchSession]);

  const handleSessionUpdate = (updatedSession: InterviewSession) => {
    setSession(updatedSession);
  };

  const handleSessionEnd = () => {
    // Navigate back to interview dashboard
    router.push('/interview');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg font-medium">
            {error || 'Interview session not found'}
          </div>
          <button
            onClick={() => router.push('/interview')}
            className="text-primary hover:underline"
          >
            Return to Interview Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <InterviewInterface
      session={session}
      onSessionUpdate={handleSessionUpdate}
      onSessionEnd={handleSessionEnd}
    />
  );
}