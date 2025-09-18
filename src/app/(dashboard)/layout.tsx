import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | ApplyMint AI',
  description: 'Your AI-powered job search dashboard.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}