'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Save, 
  Check, 
  Globe,
  Linkedin,
  Github,
  MapPin,
  FileText,
  Download
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/components/auth/auth-provider'
import { ResumeBuilder } from '@/components/profile/resume-builder'
import { ImportResume } from '@/components/profile/import-resume'

// Enhanced profile schema with additional fields
const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  phone_number: z.string().optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  github_url: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, profile, updateProfile, loading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('personal')

  // Profile form
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
      bio: '',
      location: '',
      website: '',
      linkedin_url: '',
      github_url: '',
    },
  })

  // Reset profile form when profile loads
  if (profile && !profileForm.formState.isDirty) {
    profileForm.reset({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone_number: profile.phone_number || '',
      bio: '',
      location: '',
      website: '',
      linkedin_url: '',
      github_url: '',
    })
  }

  const onSubmit = async (data: ProfileForm) => {
    setIsUpdating(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number || null,
      })

      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Profile &amp; Resume Builder</h1>
          <p className="text-muted-foreground">
            Manage your personal information, build your resume, and export to PDF
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-chart-2/10 text-chart-2 border border-chart-2/20 p-4 rounded-lg flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <p className="text-sm">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Resume Builder</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export &amp; Import</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary font-medium">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John"
                                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                                  disabled={isUpdating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-primary font-medium">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Doe"
                                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                                  disabled={isUpdating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  placeholder="+1 (555) 123-4567"
                                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                                  disabled={isUpdating}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-medium">Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Tell us about yourself..."
                                className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 min-h-[100px]"
                                disabled={isUpdating}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-medium">Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  placeholder="San Francisco, CA"
                                  className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                                  disabled={isUpdating}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isUpdating || !profileForm.formState.isDirty}
                      >
                        {isUpdating ? (
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
                  </Form>
                </CardContent>
              </Card>

              {/* Links & Social */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Links &amp; Social</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-medium">Website</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="https://yourwebsite.com"
                                className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                                disabled={isUpdating}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="linkedin_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-medium">LinkedIn</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                                disabled={isUpdating}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="github_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-medium">GitHub</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="https://github.com/yourusername"
                                className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 pl-10"
                                disabled={isUpdating}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Account Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <p className="text-foreground mt-1">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Email cannot be changed from this page. Contact support if you need to update your email address.
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                        <p className="text-foreground mt-1">
                          {user.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email Verification Status</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {user.isEmailVerified ? (
                            <>
                              <div className="h-2 w-2 bg-chart-2 rounded-full"></div>
                              <span className="text-chart-2 text-sm">Verified</span>
                            </>
                          ) : (
                            <>
                              <div className="h-2 w-2 bg-chart-4 rounded-full"></div>
                              <span className="text-chart-4 text-sm">Pending Verification</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Resume Builder Tab */}
          <TabsContent value="resume" className="space-y-6">
            <ResumeBuilder
              onSave={async (data) => {
                console.log('Resume data:', data)
                // TODO: Implement save to database
              }}
            />
          </TabsContent>

          {/* Export & Import Tab */}
          <TabsContent value="export" className="space-y-6">
            <ImportResume
              onImportComplete={(data) => {
                console.log('Imported resume data:', data)
                // TODO: Integrate with resume builder to populate forms
                alert('Resume imported successfully! Check console for data.')
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}