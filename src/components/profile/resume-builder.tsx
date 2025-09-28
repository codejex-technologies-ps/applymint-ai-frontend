'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  FolderOpen,
  Save,
  Calendar,
  MapPin,
  Building
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Resume data schemas
const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrentRole: z.boolean(),
  skills: z.array(z.string()),
})

const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
})

const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  category: z.enum(['TECHNICAL', 'SOFT', 'LANGUAGE', 'TOOL']),
})

const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()),
  projectUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
})

const languageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Language name is required'),
  proficiency: z.enum(['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE']),
})

const resumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(255),
  summary: z.string().max(2000, 'Summary must be less than 2000 characters').optional().or(z.literal('')),
  experience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  certifications: z.array(certificationSchema),
  projects: z.array(projectSchema),
  languages: z.array(languageSchema),
})

type WorkExperience = z.infer<typeof workExperienceSchema>
type Education = z.infer<typeof educationSchema>
type Skill = z.infer<typeof skillSchema>
type Certification = z.infer<typeof certificationSchema>
type Project = z.infer<typeof projectSchema>
type Language = z.infer<typeof languageSchema>
type ResumeForm = z.infer<typeof resumeSchema>

interface ResumeBuilderProps {
  onSave?: (data: ResumeForm) => Promise<void>
  initialData?: Partial<ResumeForm>
}

export function ResumeBuilder({ onSave, initialData }: ResumeBuilderProps) {
  // Resume form with field arrays
  const form = useForm<ResumeForm>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      title: initialData?.title || 'My Resume',
      summary: initialData?.summary || '',
      experience: initialData?.experience || [],
      education: initialData?.education || [],
      skills: initialData?.skills || [],
      certifications: initialData?.certifications || [],
      projects: initialData?.projects || [],
      languages: initialData?.languages || [],
    },
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: 'experience',
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: 'education',
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: 'skills',
  })

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: 'certifications',
  })

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: 'projects',
  })

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: 'languages',
  })

  // Helper functions for adding new items
  const addNewExperience = () => {
    appendExperience({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      skills: [],
    })
  }

  const addNewEducation = () => {
    appendEducation({
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    })
  }

  const addNewSkill = () => {
    appendSkill({
      id: crypto.randomUUID(),
      name: '',
      level: 'INTERMEDIATE',
      category: 'TECHNICAL',
    })
  }

  const addNewCertification = () => {
    appendCertification({
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    })
  }

  const addNewProject = () => {
    appendProject({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      technologies: [],
      projectUrl: '',
      githubUrl: '',
      startDate: '',
      endDate: '',
    })
  }

  const addNewLanguage = () => {
    appendLanguage({
      id: crypto.randomUUID(),
      name: '',
      proficiency: 'CONVERSATIONAL',
    })
  }

  const handleSave = async (data: ResumeForm) => {
    if (onSave) {
      await onSave(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        {/* Resume Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Resume Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Resume Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="My Professional Resume"
                      className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write a brief professional summary highlighting your key achievements and career goals..."
                      className="bg-background text-foreground border border-input focus:border-ring focus:ring-2 focus:ring-ring/20 min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Work Experience</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewExperience}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Experience</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {experienceFields.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No work experience added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewExperience}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Experience</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-primary">Experience #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>Company</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Company Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Job Title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.location`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>Location</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="City, State" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={`experience.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Start Date</span>
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`experience.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="date"
                                    disabled={form.watch(`experience.${index}.isCurrentRole`)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`experience.${index}.isCurrentRole`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Currently working here</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe your role, responsibilities, and achievements..."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Education</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewEducation}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {educationFields.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No education added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewEducation}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Education</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-primary">Education #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`education.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="University Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Bachelor's, Master's, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.fieldOfStudy`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Study</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Computer Science, Business, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.grade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade/GPA (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="3.8/4.0, First Class, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`education.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`education.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Relevant coursework, achievements, etc..."
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Skills</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewSkill}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Skill</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skillFields.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No skills added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewSkill}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skills</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-primary text-sm">Skill #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="text-destructive hover:text-destructive/80 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name={`skills.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Skill Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="JavaScript, Project Management, etc." className="text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name={`skills.${index}.level`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                                  <SelectItem value="EXPERT">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`skills.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                                  <SelectItem value="SOFT">Soft Skill</SelectItem>
                                  <SelectItem value="LANGUAGE">Language</SelectItem>
                                  <SelectItem value="TOOL">Tool</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Resume Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Resume
          </Button>
        </div>
      </form>
    </Form>
  )
}