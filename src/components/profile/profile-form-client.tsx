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
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Briefcase,
  Building,
  Calendar,
  Eye,
  Clock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ProfileFormClientProps {
  profile: {
    first_name?: string | null
    last_name?: string | null
    phone_number?: string | null
    bio?: string | null
    location?: string | null
    website?: string | null
    linkedin_url?: string | null
    github_url?: string | null
    twitter_url?: string | null
    portfolio_url?: string | null
    current_position?: string | null
    company?: string | null
    years_of_experience?: number | null
    availability_status?: 'available' | 'not_available' | 'open_to_opportunities'
    preferred_work_type?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship'
    profile_visibility?: 'public' | 'private' | 'connections_only'
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
    <div className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-chart-2/10 text-chart-2 border border-chart-2/20' 
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-primary mb-2">
                  First Name *
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter your first name"
                  defaultValue={profile.first_name || ''}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-primary mb-2">
                  Last Name *
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter your last name"
                  defaultValue={profile.last_name || ''}
                  required
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-primary mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                defaultValue={profile.phone_number || ''}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-primary mb-2">
                Professional Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                defaultValue={profile.bio || ''}
                rows={4}
                maxLength={2000}
                className="w-full resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {profile.bio?.length || 0}/2000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location & Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-primary mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="San Francisco, CA"
                defaultValue={profile.location || ''}
                maxLength={100}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-primary mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Personal Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourwebsite.com"
                defaultValue={profile.website || ''}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Linkedin className="w-5 h-5" />
              <span>Social Profiles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-primary mb-2">
                <Linkedin className="w-4 h-4 inline mr-1" />
                LinkedIn Profile
              </label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                defaultValue={profile.linkedin_url || ''}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="github_url" className="block text-sm font-medium text-primary mb-2">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub Profile
              </label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                placeholder="https://github.com/yourusername"
                defaultValue={profile.github_url || ''}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="twitter_url" className="block text-sm font-medium text-primary mb-2">
                <Twitter className="w-4 h-4 inline mr-1" />
                Twitter/X Profile
              </label>
              <Input
                id="twitter_url"
                name="twitter_url"
                type="url"
                placeholder="https://twitter.com/yourusername"
                defaultValue={profile.twitter_url || ''}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="portfolio_url" className="block text-sm font-medium text-primary mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Portfolio URL
              </label>
              <Input
                id="portfolio_url"
                name="portfolio_url"
                type="url"
                placeholder="https://portfolio.yourname.com"
                defaultValue={profile.portfolio_url || ''}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Professional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="current_position" className="block text-sm font-medium text-primary mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Current Position
              </label>
              <Input
                id="current_position"
                name="current_position"
                type="text"
                placeholder="Senior Software Engineer"
                defaultValue={profile.current_position || ''}
                maxLength={100}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-primary mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Current Company
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Tech Company Inc"
                defaultValue={profile.company || ''}
                maxLength={100}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="years_of_experience" className="block text-sm font-medium text-primary mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Years of Experience
              </label>
              <Input
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                placeholder="5"
                defaultValue={profile.years_of_experience || ''}
                min={0}
                max={50}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Job Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="availability_status" className="block text-sm font-medium text-primary mb-2">
                Availability Status
              </label>
              <Select name="availability_status" defaultValue={profile.availability_status || 'available'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="not_available">Not Available</SelectItem>
                  <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="preferred_work_type" className="block text-sm font-medium text-primary mb-2">
                Preferred Work Type
              </label>
              <Select name="preferred_work_type" defaultValue={profile.preferred_work_type || 'full_time'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="profile_visibility" className="block text-sm font-medium text-primary mb-2">
                <Eye className="w-4 h-4 inline mr-1" />
                Profile Visibility
              </label>
              <Select name="profile_visibility" defaultValue={profile.profile_visibility || 'public'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select profile visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="connections_only">Connections Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}