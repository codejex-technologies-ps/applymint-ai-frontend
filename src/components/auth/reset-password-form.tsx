'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Leaf, Check, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()
  
  // Only create Supabase client on client side
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    // Initialize Supabase client only on client side
    const initSupabase = async () => {
      try {
        const client = createClient()
        setSupabase(client)
      } catch (error) {
        console.error('Failed to initialize Supabase:', error)
        setIsValidSession(false)
      }
    }
    
    initSupabase()
  }, [])

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const watchPassword = form.watch('password')

  const passwordRequirements = [
    { met: watchPassword.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(watchPassword), text: 'One uppercase letter' },
    { met: /[a-z]/.test(watchPassword), text: 'One lowercase letter' },
    { met: /[0-9]/.test(watchPassword), text: 'One number' },
  ]

  // Check if we have a valid session for password reset
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          setIsValidSession(false)
          return
        }

        // Additional check: verify this is a password reset session
        // This is typically handled by Supabase's session management
        setIsValidSession(true)
      } catch {
        setIsValidSession(false)
      }
    }

    checkSession()
  }, [supabase])

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!supabase) {
      setError('Authentication service is not available')
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })
      
      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)
      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push('/login?message=password_reset')
      }, 2000)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-4"></div>
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Invalid or expired link</h2>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request new reset link</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
            <Check className="w-8 h-8 text-chart-2" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Password updated!</h2>
          <p className="text-muted-foreground">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Continue to sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    )
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
            Set new password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Reset Password Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Create a strong password"
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
                  
                  {/* Password Requirements */}
                  {watchPassword && (
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <div className={cn(
                            "w-3 h-3 rounded-full flex items-center justify-center",
                            req.met ? "bg-chart-2" : "bg-muted"
                          )}>
                            {req.met && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <span className={cn(
                            req.met ? "text-chart-2" : "text-muted-foreground"
                          )}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Confirm new password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                        className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
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

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </form>
        </Form>

        {/* Back to login */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}