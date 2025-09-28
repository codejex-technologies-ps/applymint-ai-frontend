import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

    const { sessionId, model = 'gemini-live-2.5-flash-preview' } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Gemini API not configured' },
        { status: 503 }
      );
    }

    try {
      // Request ephemeral token from Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1alpha/ephemeralTokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${geminiApiKey}`,
        },
        body: JSON.stringify({
          ttl: '3600s', // 1 hour
          scopes: ['https://www.googleapis.com/auth/generative-language.retriever'],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error:', errorData);
        return NextResponse.json(
          { error: 'Failed to create ephemeral token' },
          { status: response.status }
        );
      }

      const tokenData = await response.json();

      return NextResponse.json({
        success: true,
        data: {
          ephemeralToken: tokenData.token,
          expiresAt: tokenData.expiresAt,
          model,
          audioConfig: {
            sampleRate: 16000,
            channels: 1,
            bitDepth: 16,
            encoding: 'linear16'
          }
        }
      });
    } catch (error) {
      console.error('Error creating ephemeral token:', error);
      return NextResponse.json(
        { error: 'Failed to create ephemeral token' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in gemini-token endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}