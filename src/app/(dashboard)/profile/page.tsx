import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Mail, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProfile } from '@/lib/actions/profile-actions'
import { ProfileFormClient } from '@/components/profile/profile-form-client'
import { ProfileTabsClient } from '@/components/profile/profile-tabs-client'
import { ResumeBuilder } from '@/components/profile/resume-builder'
import { ImportResume } from '@/components/profile/import-resume'

// Loading component for async sections
function ProfileLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Loading profile...</span>
    </div>
  )
}

// Main profile content
async function ProfileContent() {
  const data = await getProfile()
  
  if (!data) {
    redirect('/login')
  }

  const { user, profile } = data

  return (
    <ProfileTabsClient
      personalInfoTab={
        <div className="space-y-6">
          <ProfileFormClient profile={profile} />
          
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
      }
      resumeBuilderTab={
        <Suspense fallback={<ProfileLoading />}>
          <ResumeBuilder
            onSave={async (data) => {
              console.log('Resume data:', data)
              // TODO: Implement save to database via server action
            }}
          />
        </Suspense>
      }
      exportImportTab={
        <Suspense fallback={<ProfileLoading />}>
          <ImportResume
            onImportComplete={(data) => {
              console.log('Imported resume data:', data)
              // TODO: Integrate with resume builder to populate forms
              alert('Resume imported successfully! Check console for data.')
            }}
          />
        </Suspense>
      }
    />
  )
}

export default async function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Profile & Resume Builder</h1>
          <p className="text-muted-foreground">
            Manage your personal information, build your resume, and export to PDF
          </p>
        </div>

        {/* Main Content with Suspense */}
        <Suspense fallback={<ProfileLoading />}>
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  )
}