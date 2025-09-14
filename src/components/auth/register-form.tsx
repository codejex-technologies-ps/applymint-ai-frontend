'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Leaf, Check } from 'lucide-react'

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
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  const watchPassword = form.watch('password')

  const passwordRequirements = [
    { met: watchPassword.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(watchPassword), text: 'One uppercase letter' },
    { met: /[a-z]/.test(watchPassword), text: 'One lowercase letter' },
    { met: /[0-9]/.test(watchPassword), text: 'One number' },
  ]

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
      })
      
      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      // Note: User will need to verify email before they can sign in
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
            <Check className="w-8 h-8 text-chart-2" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Check your email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Return to sign in</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email?{' '}
              <button 
                className="text-primary hover:text-primary/80 font-medium"
                onClick={() => setSuccess(false)}
              >
                Try again
              </button>
            </p>
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your AI-powered job search journey today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Register Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium">First name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="John"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium">Last name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Doe"
                        className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      placeholder="john@example.com"
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
                  <FormLabel className="text-primary font-medium">Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Confirm your password"
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

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-foreground font-normal">
                      I agree to the{' '}
                      <Link href="/terms-of-service" className="text-primary hover:text-primary/80 font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" className="text-primary hover:text-primary/80 font-medium">
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </Form>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
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