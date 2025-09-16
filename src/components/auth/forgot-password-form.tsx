'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Leaf, Check, ArrowLeft, Mail } from 'lucide-react'

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
import { useAuth } from './auth-provider'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(data.email)
      
      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
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
            We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-primary">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Forgot Password Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      placeholder="Enter your email address"
                      className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                      disabled={isLoading}
                    />
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
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        </Form>

        {/* Back to login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}