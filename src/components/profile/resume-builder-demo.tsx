'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  User, 
  FileText, 
  Download,
  Plus,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react'
import { ResumeBuilder } from './resume-builder'
import { ImportResume } from './import-resume'

export function ResumeBuilderDemo() {
  const [activeTab, setActiveTab] = useState('personal')

  // Demo user data
  const demoUser = {
    email: 'demo@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    isEmailVerified: true,
  }

  // Demo profile data
  const demoProfile = {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1 (555) 123-4567',
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">Profile & Resume Builder Demo</h1>
          <p className="text-muted-foreground">
            Interactive demonstration of the profile management and resume builder features
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-chart-1/10 text-chart-1 border border-chart-1/20 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">🎯 Demo Mode Active</p>
          <p className="text-sm">
            This is a demonstration of the Profile & Resume Builder functionality. 
            In production, this would require user authentication and save data to the database.
          </p>
        </div>

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
              <span>Export & Import</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab - Demo */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demo Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground mt-1">{demoProfile.first_name} {demoProfile.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground mt-1">{demoUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground mt-1">{demoProfile.phone_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="h-2 w-2 bg-chart-2 rounded-full"></div>
                      <span className="text-chart-2 text-sm">Demo User - Email Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Profile Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-chart-2">
                      <User className="h-4 w-4" />
                      <span>Extended profile fields</span>
                    </div>
                    <div className="flex items-center space-x-2 text-chart-2">
                      <FileText className="h-4 w-4" />
                      <span>Resume management</span>
                    </div>
                    <div className="flex items-center space-x-2 text-chart-2">
                      <Download className="h-4 w-4" />
                      <span>PDF export ready</span>
                    </div>
                    <div className="flex items-center space-x-2 text-chart-2">
                      <Award className="h-4 w-4" />
                      <span>Skills & certifications</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    The personal information tab includes bio, location, website, LinkedIn, and GitHub URL fields with proper validation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resume Builder Tab */}
          <TabsContent value="resume" className="space-y-6">
            <div className="mb-4 p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">Interactive Resume Builder</h3>
              <p className="text-sm text-muted-foreground">
                Try adding work experience, education, and skills. All forms include validation and the interface supports add/remove functionality.
              </p>
            </div>
            <ResumeBuilder />
          </TabsContent>

          {/* Export & Import Tab - Demo */}
          <TabsContent value="export" className="space-y-6">
            <div className="mb-4 p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">Resume Import & Export Demo</h3>
              <p className="text-sm text-muted-foreground">
                Try uploading a resume file (PDF/DOC) to see the import functionality in action. The system will simulate parsing and extract mock data.
              </p>
            </div>
            <ImportResume />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}