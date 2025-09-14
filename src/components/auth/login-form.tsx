'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from './auth-provider'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const message = searchParams.get('message')

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        // Handle email not confirmed error
        if (error === 'email_not_confirmed') {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
          return
        }
        setError(error)
        return
      }

      // Redirect to dashboard or home page after successful login
      router.push('/dashboard')
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-chart-2 to-chart-1 rounded-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">ApplyMint AI</span>
          </Link>
          <h2 className="text-3xl font-bold text-primary">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your AI-powered job search journey
          </p>
        </div>

        {/* Success Alert for email verification */}
        {message === 'email_verified' && (
          <div className="bg-chart-2/10 text-chart-2 border border-chart-2/20 p-4 rounded-lg">
            <p className="text-sm">Email verified successfully! You can now sign in.</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium">Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-muted-foreground font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Form>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Social Login - Placeholder for future implementation */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            disabled
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="secondary"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
            disabled
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.581-2.043 4.993-.905 1.116-2.072 1.997-3.378 2.558-.653.281-1.337.461-2.043.54-.706.079-1.416.098-2.123.058-.707-.04-1.407-.14-2.093-.3-.686-.16-1.35-.38-1.99-.66-.64-.28-1.25-.62-1.83-1.02-.58-.4-1.12-.86-1.62-1.36-.5-.5-.96-1.04-1.36-1.62-.4-.58-.74-1.19-1.02-1.83-.28-.64-.5-1.304-.66-1.99-.16-.686-.26-1.386-.3-2.093-.04-.707-.021-1.417.058-2.123.079-.706.259-1.39.54-2.043.561-1.306 1.442-2.473 2.558-3.378 1.412-1.147 3.135-1.874 4.993-2.043 1.858-.169 3.739.054 5.417.639 1.678.585 3.196 1.56 4.367 2.831 1.171 1.271 2.002 2.819 2.394 4.463.392 1.644.322 3.369-.2 4.971z"/>
            </svg>
            GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}