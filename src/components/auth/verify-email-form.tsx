'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Leaf, Check, RotateCcw, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useAuth } from './auth-provider'

export function VerifyEmailForm() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const { verifySignUp, resendVerification } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email') || ''

  // Auto-submit when OTP is complete
  useEffect(() => {
    const handleVerifyOTP = async () => {
      if (!email) {
        setError('Email parameter is missing. Please try registering again.')
        return
      }

      if (otp.length !== 6) {
        setError('Please enter the complete 6-digit verification code.')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const { error } = await verifySignUp(email, otp)
        
        if (error) {
          setError(error)
          return
        }

        setSuccess(true)
        // Redirect to login after a brief delay
        setTimeout(() => {
          router.push('/login?message=email_verified')
        }, 2000)
      } catch {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (otp.length === 6 && !isLoading) {
      handleVerifyOTP()
    }
  }, [otp, email, verifySignUp, router, isLoading])

  const handleVerify = async () => {
    if (!email) {
      setError('Email parameter is missing. Please try registering again.')
      return
    }

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await verifySignUp(email, otp)
      
      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push('/login?message=email_verified')
      }, 2000)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError('Email parameter is missing. Please try registering again.')
      return
    }

    setIsResending(true)
    setError(null)
    setResendSuccess(false)

    try {
      const { error } = await resendVerification(email)
      
      if (error) {
        setError(error)
        return
      }

      setResendSuccess(true)
      setOtp('') // Clear the current OTP
      // Hide success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false)
      }, 3000)
    } catch {
      setError('Failed to resend verification code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
            <Check className="w-8 h-8 text-chart-2" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Email verified!</h2>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now sign in to your account.
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-primary">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-foreground">{email}</p>
        </div>

        {/* Success Alert for Resend */}
        {resendSuccess && (
          <div className="bg-chart-2/10 text-chart-2 border border-chart-2/20 p-4 rounded-lg">
            <p className="text-sm">Verification code resent successfully!</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Enter verification code
            </label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value)
                  setError(null) // Clear error when user starts typing
                }}
                disabled={isLoading}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify email'
            )}
          </Button>

          {/* Resend Code */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            >
              {isResending ? (
                <>
                  <RotateCcw className="mr-1 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                'Resend verification code'
              )}
            </Button>
          </div>

          {/* Back to Registration */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Wrong email address?{' '}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                Go back to registration
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}