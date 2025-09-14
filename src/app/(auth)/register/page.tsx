import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Create Account | ApplyMint AI',
  description: 'Create your ApplyMint AI account and start your AI-powered job search journey today.',
}

export default function RegisterPage() {
  return <RegisterForm />
}