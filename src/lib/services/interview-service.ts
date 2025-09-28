import { db } from '@/lib/db/connection';
import { 
  interviewSessions, 
  interviewQuestions, 
  interviewResponses, 
  interviewMessages,
  type InsertInterviewSession,
  type InsertInterviewQuestion,
  type InsertInterviewResponse,
  type InsertInterviewMessage,
  type InterviewSession,
  type InterviewQuestion,
  type InterviewResponse,
  type InterviewMessage
} from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export class InterviewService {
  // Session Management
  async createSession(data: InsertInterviewSession): Promise<InterviewSession> {
    const [session] = await db.insert(interviewSessions).values(data).returning();
    return session;
  }

  async getSessionById(sessionId: string): Promise<InterviewSession | null> {
    const [session] = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.id, sessionId))
      .limit(1);
    
    return session || null;
  }

  async getUserSessions(userId: string): Promise<InterviewSession[]> {
    return await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.createdAt));
  }

  async updateSession(sessionId: string, updates: Partial<InterviewSession>): Promise<InterviewSession | null> {
    const [session] = await db
      .update(interviewSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviewSessions.id, sessionId))
      .returning();
    
    return session || null;
  }

  // Question Management
  async createQuestion(data: InsertInterviewQuestion): Promise<InterviewQuestion> {
    const [question] = await db.insert(interviewQuestions).values(data).returning();
    return question;
  }

  async getSessionQuestions(sessionId: string): Promise<InterviewQuestion[]> {
    return await db
      .select()
      .from(interviewQuestions)
      .where(eq(interviewQuestions.sessionId, sessionId))
      .orderBy(interviewQuestions.order);
  }

  async updateQuestion(questionId: string, updates: Partial<InterviewQuestion>): Promise<InterviewQuestion | null> {
    const [question] = await db
      .update(interviewQuestions)
      .set(updates)
      .where(eq(interviewQuestions.id, questionId))
      .returning();
    
    return question || null;
  }

  // Response Management
  async createResponse(data: InsertInterviewResponse): Promise<InterviewResponse> {
    const [response] = await db.insert(interviewResponses).values(data).returning();
    return response;
  }

  async getQuestionResponse(questionId: string): Promise<InterviewResponse | null> {
    const [response] = await db
      .select()
      .from(interviewResponses)
      .where(eq(interviewResponses.questionId, questionId))
      .limit(1);
    
    return response || null;
  }

  async getSessionResponses(sessionId: string): Promise<InterviewResponse[]> {
    return await db
      .select({
        id: interviewResponses.id,
        questionId: interviewResponses.questionId,
        answer: interviewResponses.answer,
        audioUrl: interviewResponses.audioUrl,
        transcription: interviewResponses.transcription,
        duration: interviewResponses.duration,
        communicationScore: interviewResponses.communicationScore,
        technicalScore: interviewResponses.technicalScore,
        completenessScore: interviewResponses.completenessScore,
        overallScore: interviewResponses.overallScore,
        strengths: interviewResponses.strengths,
        weaknesses: interviewResponses.weaknesses,
        suggestions: interviewResponses.suggestions,
        improvedAnswer: interviewResponses.improvedAnswer,
        submittedAt: interviewResponses.submittedAt,
        createdAt: interviewResponses.createdAt,
      })
      .from(interviewResponses)
      .innerJoin(interviewQuestions, eq(interviewResponses.questionId, interviewQuestions.id))
      .where(eq(interviewQuestions.sessionId, sessionId))
      .orderBy(interviewQuestions.order);
  }

  // Message/Conversation Management
  async createMessage(data: InsertInterviewMessage): Promise<InterviewMessage> {
    const [message] = await db.insert(interviewMessages).values(data).returning();
    return message;
  }

  async getSessionMessages(sessionId: string): Promise<InterviewMessage[]> {
    return await db
      .select()
      .from(interviewMessages)
      .where(eq(interviewMessages.sessionId, sessionId))
      .orderBy(interviewMessages.messageIndex);
  }

  async getSessionConversation(sessionId: string): Promise<{
    session: InterviewSession;
    messages: InterviewMessage[];
    questions: InterviewQuestion[];
    responses: InterviewResponse[];
  } | null> {
    const session = await this.getSessionById(sessionId);
    if (!session) return null;

    const [messages, questions, responses] = await Promise.all([
      this.getSessionMessages(sessionId),
      this.getSessionQuestions(sessionId),
      this.getSessionResponses(sessionId),
    ]);

    return {
      session,
      messages,
      questions,
      responses,
    };
  }

  // Analytics and Statistics
  async getUserSessionStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    totalPracticeTime: number; // in minutes
  }> {
    const sessions = await this.getUserSessions(userId);
    
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    
    const completedWithScores = sessions.filter(s => 
      s.status === 'completed' && s.overallScore !== null
    );
    
    const averageScore = completedWithScores.length > 0
      ? completedWithScores.reduce((sum, s) => sum + (s.overallScore || 0), 0) / completedWithScores.length
      : 0;

    const totalPracticeTime = sessions
      .filter(s => s.startedAt && (s.completedAt || s.status === 'active'))
      .reduce((total, s) => {
        const endTime = s.completedAt ? new Date(s.completedAt) : new Date();
        const startTime = new Date(s.startedAt!);
        const durationMs = endTime.getTime() - startTime.getTime();
        return total + (durationMs / (1000 * 60)); // Convert to minutes
      }, 0);

    return {
      totalSessions,
      completedSessions,
      averageScore: Math.round(averageScore * 10) / 10,
      totalPracticeTime: Math.round(totalPracticeTime),
    };
  }
}

export const interviewService = new InterviewService();