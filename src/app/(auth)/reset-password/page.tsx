import { Suspense } from 'react'
import { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password | ApplyMint AI',
  description: 'Reset your ApplyMint AI account password.',
}

// Force dynamic rendering to avoid build issues with Supabase
export const dynamic = 'force-dynamic'

function ResetPasswordFormFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-4"></div>
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded mb-4"></div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFormFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}