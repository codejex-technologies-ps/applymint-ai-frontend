'use client'

import { EnhancedAuthTest } from './enhanced-auth-test'

export default function AuthDebugPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Authentication Debug Center</h1>
          <p className="text-muted-foreground">
            Comprehensive testing tools for authentication and dashboard functionality
          </p>
        </div>

        <EnhancedAuthTest />
      </div>
    </div>
  )
}