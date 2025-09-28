'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth/auth-provider'
import { dashboardService } from '@/lib/services/dashboard-service'
import { CheckCircle, XCircle, Clock, Play, User, Database } from 'lucide-react'

interface TestResult {
  test: string
  status: 'success' | 'error' | 'warning' | 'running'
  message: string
  details?: Record<string, unknown>
}

export function EnhancedAuthTest() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [testEmail, setTestEmail] = useState('test@applymint.com')
  const [testPassword, setTestPassword] = useState('TestPassword123!')
  const { user, signUp, signIn, signOut } = useAuth()

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, { ...result, timestamp: Date.now() }])
  }

  const updateLastResult = (updates: Partial<TestResult>) => {
    setResults(prev => {
      const newResults = [...prev]
      if (newResults.length > 0) {
        newResults[newResults.length - 1] = { ...newResults[newResults.length - 1], ...updates }
      }
      return newResults
    })
  }

  const runEnhancedTests = async () => {
    setIsRunning(true)
    setResults([])

    try {
      // Test 1: Environment Check
      addResult({
        test: 'Environment Configuration',
        status: 'running',
        message: 'Checking environment variables...',
      })

      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      updateLastResult({
        status: hasSupabaseUrl && hasSupabaseKey ? 'success' : 'error',
        message: hasSupabaseUrl && hasSupabaseKey 
          ? 'Environment variables configured correctly' 
          : 'Missing Supabase environment variables',
        details: {
          supabaseUrl: hasSupabaseUrl ? 'Set' : 'Missing',
          supabaseKey: hasSupabaseKey ? 'Set' : 'Missing'
        }
      })

      // Test 2: Sign Up Flow
      addResult({
        test: 'User Registration',
        status: 'running',
        message: 'Testing user registration...',
      })

      try {
        const signUpResult = await signUp(testEmail, testPassword, {
          first_name: 'Test',
          last_name: 'User'
        })

        if (signUpResult.error) {
          if (signUpResult.error.includes('already registered')) {
            updateLastResult({
              status: 'warning',
              message: 'User already exists (expected for testing)',
              details: { error: signUpResult.error }
            })
          } else {
            updateLastResult({
              status: 'error',
              message: `Registration failed: ${signUpResult.error}`,
              details: { error: signUpResult.error }
            })
          }
        } else {
          updateLastResult({
            status: 'success',
            message: 'User registration successful',
            details: { email: testEmail }
          })
        }
      } catch (error) {
        updateLastResult({
          status: 'error',
          message: `Registration error: ${error}`,
          details: { error: String(error) }
        })
      }

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Test 3: Sign In Flow
      addResult({
        test: 'User Sign In',
        status: 'running',
        message: 'Testing user sign in...',
      })

      try {
        const signInResult = await signIn(testEmail, testPassword)

        if (signInResult.error) {
          updateLastResult({
            status: 'error',
            message: `Sign in failed: ${signInResult.error}`,
            details: { error: signInResult.error }
          })
        } else {
          updateLastResult({
            status: 'success',
            message: 'User sign in successful',
            details: { email: testEmail }
          })
        }
      } catch (error) {
        updateLastResult({
          status: 'error',
          message: `Sign in error: ${error}`,
          details: { error: String(error) }
        })
      }

      // Wait for auth state to update
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Test 4: User Profile Check
      addResult({
        test: 'User Profile Access',
        status: 'running',
        message: 'Checking user profile data...',
      })

      if (user) {
        updateLastResult({
          status: 'success',
          message: 'User profile loaded successfully',
          details: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: user.isEmailVerified
          }
        })
      } else {
        updateLastResult({
          status: 'error',
          message: 'User profile not available after sign in',
        })
      }

      // Test 5: Dashboard Data Loading
      if (user?.id) {
        addResult({
          test: 'Dashboard Data Loading',
          status: 'running',
          message: 'Testing dashboard service...',
        })

        try {
          const [stats, activities, recommendations] = await Promise.all([
            dashboardService.getDashboardStats(user.id),
            dashboardService.getRecentActivity(user.id),
            dashboardService.getJobRecommendations(user.id),
          ])

          updateLastResult({
            status: 'success',
            message: 'Dashboard data loaded successfully',
            details: {
              statsLoaded: !!stats,
              activitiesCount: activities.length,
              recommendationsCount: recommendations.length
            }
          })
        } catch (error) {
          updateLastResult({
            status: 'error',
            message: `Dashboard data loading failed: ${error}`,
            details: { error: String(error) }
          })
        }

        // Test 6: First-time User Detection
        addResult({
          test: 'First-time User Detection',
          status: 'running',
          message: 'Testing first-time user logic...',
        })

        try {
          const isFirstTime = await dashboardService.isFirstTimeUser(user.id)
          updateLastResult({
            status: 'success',
            message: `First-time user detection working`,
            details: { isFirstTime }
          })
        } catch (error) {
          updateLastResult({
            status: 'error',
            message: `First-time user detection failed: ${error}`,
            details: { error: String(error) }
          })
        }
      }

      // Test 7: Sign Out Flow
      addResult({
        test: 'User Sign Out',
        status: 'running',
        message: 'Testing sign out...',
      })

      try {
        await signOut()
        
        // Wait for auth state to update
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        updateLastResult({
          status: 'success',
          message: 'User signed out successfully',
        })
      } catch (error) {
        updateLastResult({
          status: 'error',
          message: `Sign out error: ${error}`,
          details: { error: String(error) }
        })
      }

    } catch (error) {
      addResult({
        test: 'Overall Test Suite',
        status: 'error',
        message: `Test suite failed: ${error}`,
        details: { error: String(error) }
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'running':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      running: 'outline',
    } as const

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Enhanced Authentication & Dashboard Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Test Email</label>
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Test Password</label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Password123!"
                disabled={isRunning}
              />
            </div>
          </div>
          
          <Button
            onClick={runEnhancedTests}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Enhanced Test Suite
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current User Status */}
      {user && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <User className="h-5 w-5" />
              <span>Current User Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Test Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg border"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{result.test}</h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.message}
                    </p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">
                          View Details
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-blue-800">
            <h4 className="font-medium mb-2">Test Instructions:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Configure your Supabase environment variables</li>
              <li>Enter a test email and password above</li>
              <li>Click &quot;Run Enhanced Test Suite&quot; to test the complete flow</li>
              <li>The test will check registration, sign in, dashboard data, and sign out</li>
              <li>Check the results for any issues that need to be addressed</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}