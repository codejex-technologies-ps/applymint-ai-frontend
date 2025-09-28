'use client'

import { useTransition, useState } from 'react'
import { updateProfileAction } from '@/lib/actions/profile-actions'
import { 
  Loader2, 
  User, 
  Phone, 
  Save, 
  Check, 
  AlertCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProfileFormClientProps {
  profile: {
    first_name?: string | null
    last_name?: string | null
    phone_number?: string | null
  }
}

export function ProfileFormClient({ profile }: ProfileFormClientProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setMessage(null)
      
      try {
        const result = await updateProfileAction(formData)
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Profile updated successfully!' })
          setTimeout(() => setMessage(null), 5000)
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
        }
      } catch (error) {
        console.error('Form submission error:', error)
        setMessage({ type: 'error', text: 'An unexpected error occurred' })
      }
    })
  }

  return (
    <div className="max-w-2xl">
      {/* Success/Error Messages */}
      {message && (
        <div 
          className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-chart-2/10 text-chart-2 border border-chart-2/20' 
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="text-sm font-medium text-primary">
                  First Name *
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={profile.first_name || ''}
                  placeholder="John"
                  className="mt-1"
                  disabled={isPending}
                  required
                />
              </div>

              <div>
                <label htmlFor="last_name" className="text-sm font-medium text-primary">
                  Last Name *
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={profile.last_name || ''}
                  placeholder="Doe"
                  className="mt-1"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="text-sm font-medium text-primary">
                Phone Number
              </label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone_number"
                  name="phone_number"
                  defaultValue={profile.phone_number || ''}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Extended Fields Coming Soon */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Additional profile fields like bio, location, website, and social links will be available soon. 
            We&apos;re working on extending the profile system to support these features.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}