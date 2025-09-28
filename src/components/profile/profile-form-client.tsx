'use client'

import { useTransition, useState } from 'react'
import { updateProfileAction } from '@/lib/actions/profile-actions'
import { 
  Loader2, 
  User, 
  Phone, 
  Save, 
  Check, 
  Globe,
  Linkedin,
  Github,
  MapPin,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

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
      const result = await updateProfileAction(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'An error occurred' })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Success/Error Messages */}
      {message && (
        <div 
          className={`lg:col-span-2 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-chart-2/10 text-chart-2 border border-chart-2/20' 
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          <Check className="h-4 w-4" />
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
                  First Name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={profile.first_name || ''}
                  placeholder="John"
                  className="mt-1 bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                  disabled={isPending}
                  required
                />
              </div>

              <div>
                <label htmlFor="last_name" className="text-sm font-medium text-primary">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={profile.last_name || ''}
                  placeholder="Doe"
                  className="mt-1 bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
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
                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="text-sm font-medium text-primary">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                className="mt-1 bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 min-h-[100px]"
                disabled={isPending}
              />
            </div>

            <div>
              <label htmlFor="location" className="text-sm font-medium text-primary">
                Location
              </label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="San Francisco, CA"
                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="text-sm font-medium text-primary">
                Website
              </label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  name="website"
                  placeholder="https://yourwebsite.com"
                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="linkedin_url" className="text-sm font-medium text-primary">
                LinkedIn
              </label>
              <div className="relative mt-1">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="github_url" className="text-sm font-medium text-primary">
                GitHub
              </label>
              <div className="relative mt-1">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github_url"
                  name="github_url"
                  placeholder="https://github.com/yourusername"
                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
    </div>
  )
}