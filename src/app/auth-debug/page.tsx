'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { profilesService } from '@/lib/services/profiles'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: Record<string, unknown>
}

export default function AuthDebugPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [testEmail, setTestEmail] = useState('test@example.com')

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result])
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    try {
      // Test 1: Environment Variables
      addResult({
        test: 'Environment Variables',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'success' : 'error',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
          ? 'Environment variables are configured' 
          : 'Missing Supabase environment variables',
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
        }
      })

      const supabase = createClient()

      // Test 2: Supabase Connection
      try {
        const { data, error } = await supabase.auth.getSession()
        addResult({
          test: 'Supabase Connection',
          status: error ? 'error' : 'success',
          message: error ? `Connection failed: ${error.message}` : 'Successfully connected to Supabase',
          details: { session: !!data.session }
        })
      } catch (error: Error | unknown) {
        addResult({
          test: 'Supabase Connection',
          status: 'error',
          message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error instanceof Error ? { message: error.message } : { error: 'Unknown error' }
        })
      }

      // Test 3: Database Table Check
      try {
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)

        addResult({
          test: 'Profiles Table Access',
          status: error ? 'error' : 'success',
          message: error ? `Table access failed: ${error.message}` : 'Profiles table is accessible',
          details: { error: error?.code }
        })
      } catch (error: Error | unknown) {
        addResult({
          test: 'Profiles Table Access',
          status: 'error',
          message: `Table access error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error instanceof Error ? { message: error.message } : { error: 'Unknown error' }
        })
      }

      // Test 4: Test User Creation (Simulation)
      try {
        addResult({
          test: 'User Registration Simulation',
          status: 'warning',
          message: 'This would create a test user with the provided email. Profile creation depends on database trigger.',
          details: {
            email: testEmail,
            metadata: { first_name: 'Test', last_name: 'User' },
            note: 'Actual registration would send verification email'
          }
        })
      } catch (error: Error | unknown) {
        addResult({
          test: 'User Registration Simulation',
          status: 'error',
          message: `Registration simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error instanceof Error ? { message: error.message } : { error: 'Unknown error' }
        })
      }

      // Test 5: Profile Service Test
      try {
        // This will fail if no user is logged in, which is expected
        const profile = await profilesService.getCurrentProfile()
        addResult({
          test: 'Profile Service',
          status: profile ? 'success' : 'warning',
          message: profile ? 'Profile service works and user has profile' : 'No current user profile (expected if not logged in)',
          details: profile ? { profile } : undefined
        })
      } catch (error: Error | unknown) {
        addResult({
          test: 'Profile Service',
          status: 'warning',
          message: `Profile service: ${error instanceof Error ? error.message : 'Unknown error'} (expected if not authenticated)`,
          details: { message: error instanceof Error ? error.message : 'Unknown error' }
        })
      }

    } catch (error: Error | unknown) {
      addResult({
        test: 'General Error',
        status: 'error',
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error instanceof Error ? { message: error.message } : { error: 'Unknown error' }
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          🔍 Authentication Diagnostics
        </h1>
        <p className="text-muted-foreground">
          This page helps diagnose Supabase authentication issues including profile creation and email verification.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Run Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Email Address</label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{result.test}</h3>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {result.message}
                  </p>
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-red-600">❌ Profiles not being created</h4>
              <p className="text-muted-foreground">
                Run the enhanced SQL setup script in your Supabase SQL editor. 
                Check that the trigger is properly installed.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-red-600">❌ Emails not being sent</h4>
              <p className="text-muted-foreground">
                Check Authentication &gt; Settings in Supabase Dashboard. 
                Ensure SMTP is properly configured or use Supabase&apos;s built-in email service.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-red-600">❌ Permission denied errors</h4>
              <p className="text-muted-foreground">
                Verify RLS policies are correctly set up. 
                Users should be able to insert/update their own profiles.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-green-600">✅ Next Steps</h4>
              <p className="text-muted-foreground">
                1. Run the enhanced supabase-setup-enhanced.sql script<br/>
                2. Configure email settings in Supabase Dashboard<br/>
                3. Test with a real email address<br/>
                4. Check Supabase logs for any errors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}