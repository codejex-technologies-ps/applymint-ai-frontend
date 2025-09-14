import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In | ApplyMint AI',
  description: 'Sign in to your ApplyMint AI account to continue your job search journey.',
}

export default function LoginPage() {
  return <LoginForm />
}
