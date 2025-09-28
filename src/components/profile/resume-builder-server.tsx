import { ResumeBuilder } from './resume-builder'
import { saveResumeAction } from '@/lib/actions/profile-actions'

export async function ResumeBuilderServer() {
  return (
    <ResumeBuilder
      onSave={async (data) => {
        'use server'
        
        // Convert data to FormData for server action
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('summary', data.summary || '')
        formData.append('experience', JSON.stringify(data.experience))
        formData.append('education', JSON.stringify(data.education))
        formData.append('skills', JSON.stringify(data.skills))
        
        const result = await saveResumeAction(formData)
        if (result.error) {
          console.error('Error saving resume:', result.error)
        } else {
          console.log('Resume saved successfully')
        }
      }}
    />
  )
}