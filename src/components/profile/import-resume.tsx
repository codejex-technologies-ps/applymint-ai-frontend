'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Linkedin, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface ImportedData {
  personalInfo?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    location?: string
    linkedinUrl?: string
    githubUrl?: string
  }
  summary?: string
  experience?: Array<{
    company: string
    position: string
    location: string
    startDate: string
    endDate?: string
    description: string
  }>
  education?: Array<{
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate?: string
  }>
  skills?: Array<{
    name: string
    level: string
  }>
}

interface ImportResumeProps {
  onImportComplete?: (data: ImportedData) => void
}

export function ImportResume({ onImportComplete }: ImportResumeProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [importedData, setImportedData] = useState<ImportedData | null>(null)

  // Mock file upload and parsing simulation
  const simulateFileUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a PDF, DOC, or DOCX file')
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Simulate successful parsing with mock data
      const mockData: ImportedData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
      },
      summary: 'Experienced software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.',
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: '2024-12',
          description: 'Led development of scalable web applications serving millions of users. Collaborated with cross-functional teams to deliver high-quality software solutions.'
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          location: 'Remote',
          startDate: '2020-06',
          endDate: '2021-12',
          description: 'Built and maintained web applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and improved deployment processes.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016-08',
          endDate: '2020-05'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'ADVANCED' },
        { name: 'React', level: 'ADVANCED' },
        { name: 'Node.js', level: 'INTERMEDIATE' },
        { name: 'TypeScript', level: 'INTERMEDIATE' },
        { name: 'Python', level: 'INTERMEDIATE' }
      ]
    }

    setImportedData(mockData)
    setUploadSuccess(true)
    setIsUploading(false)

    if (onImportComplete) {
      onImportComplete(mockData)
    }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'An error occurred during upload')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onImportComplete])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document (.pdf, .doc, .docx)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB')
      return
    }

    await simulateFileUpload(file)
  }, [simulateFileUpload])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Create a mock event that matches the handleFileUpload signature
      const mockEvent = {
        target: {
          files: event.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>

      await handleFileUpload(mockEvent)
    }
  }, [handleFileUpload])

  const resetUpload = () => {
    setUploadProgress(0)
    setIsUploading(false)
    setUploadSuccess(false)
    setUploadError(null)
    setImportedData(null)
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Resume</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadSuccess ? (
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Processing your resume...</p>
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Drop your resume here or click to browse</p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, DOC, and DOCX files up to 10MB
                      </p>
                    </div>
                    <Button variant="outline" className="mx-auto">
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploadError && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-chart-2 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-chart-2">Resume imported successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  We extracted {importedData?.experience?.length || 0} work experiences, {importedData?.education?.length || 0} education entries, and {importedData?.skills?.length || 0} skills.
                </p>
              </div>
              <Button variant="outline" onClick={resetUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Import Another Resume
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* LinkedIn Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            <span>Import from LinkedIn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Linkedin className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Connect your LinkedIn profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Import your professional experience, education, and skills directly from LinkedIn.
              </p>
            </div>
            <Button variant="outline" disabled>
              <Linkedin className="h-4 w-4 mr-2" />
              Connect LinkedIn (Coming Soon)
            </Button>
            <p className="text-xs text-muted-foreground">
              We&apos;ll only import your professional information and won&apos;t post anything to your profile.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Github className="h-5 w-5" />
            <span>Import from GitHub</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Github className="h-8 w-8 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Connect your GitHub profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Import your projects, contributions, and technical skills from GitHub.
              </p>
            </div>
            <Button variant="outline" disabled>
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub (Coming Soon)
            </Button>
            <p className="text-xs text-muted-foreground">
              We&apos;ll analyze your repositories to suggest relevant skills and projects.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Imported Data Preview */}
      {importedData && (
        <Card>
          <CardHeader>
            <CardTitle>Imported Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <div className="bg-muted/20 p-3 rounded">
                  <p><strong>Name:</strong> {importedData.personalInfo?.firstName} {importedData.personalInfo?.lastName}</p>
                  <p><strong>Email:</strong> {importedData.personalInfo?.email}</p>
                  <p><strong>Location:</strong> {importedData.personalInfo?.location}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Experience ({importedData.experience?.length || 0} entries)</h4>
                <div className="space-y-2">
                  {importedData.experience?.map((exp, index) => (
                    <div key={index} className="bg-muted/20 p-3 rounded">
                      <p><strong>{exp.position}</strong> at {exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills ({importedData.skills?.length || 0} skills)</h4>
                <div className="flex flex-wrap gap-2">
                  {importedData.skills?.map((skill, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {skill.name} ({skill.level})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}