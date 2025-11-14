'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  Mic,
  MicOff,
  Sparkles,
  Zap,
} from 'lucide-react';
import { InterviewSetupData, QuestionType } from '@/types';

const setupSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  mode: z.enum(['text', 'voice'] as const),
  jobRole: z.string().min(1, 'Job role is required'),
  company: z.string().optional(),
  difficulty: z.enum(['entry', 'mid', 'senior', 'expert'] as const),
  duration: z.number().min(15).max(120),
  questionTypes: z.array(z.enum(['technical', 'behavioral', 'situational', 'company_specific'] as const)).min(1),
  customInstructions: z.string().optional(),
});

type SetupFormData = z.infer<typeof setupSchema>;

interface InterviewSetupDialogProps {
  onSetupComplete: (data: InterviewSetupData) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function InterviewSetupDialog({ 
  onSetupComplete, 
  isLoading = false, 
  children 
}: InterviewSetupDialogProps) {
  const [open, setOpen] = useState(false);
  const [audioSupported, setAudioSupported] = useState(true);

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      title: '',
      mode: 'text',
      jobRole: '',
      company: '',
      difficulty: 'mid',
      duration: 30,
      questionTypes: ['technical', 'behavioral'],
      customInstructions: '',
    },
  });

  const questionTypeOptions = [
    { value: 'technical', label: 'Technical', description: 'Coding, algorithms, system design' },
    { value: 'behavioral', label: 'Behavioral', description: 'Past experiences, teamwork, conflict resolution' },
    { value: 'situational', label: 'Situational', description: 'Hypothetical scenarios and problem-solving' },
    { value: 'company_specific', label: 'Company-Specific', description: 'Role-specific and company culture questions' },
  ];

  const difficultyLevels = [
    { value: 'entry', label: 'Entry Level', description: '0-2 years experience' },
    { value: 'mid', label: 'Mid Level', description: '2-5 years experience' },
    { value: 'senior', label: 'Senior Level', description: '5+ years experience' },
    { value: 'expert', label: 'Expert Level', description: 'Principal/Staff level' },
  ];

  const handleSubmit = (data: SetupFormData) => {
    onSetupComplete(data);
    setOpen(false);
    form.reset();
  };

  const checkAudioSupport = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setAudioSupported(true);
    } catch {
      setAudioSupported(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={checkAudioSupport}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Setup AI Interview</span>
          </DialogTitle>
          <DialogDescription>
            Configure your AI-powered interview session. Choose between text-based or voice interaction.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Setup */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Frontend Developer Interview Practice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Interview Mode Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Mode</FormLabel>
                    <FormDescription>
                      Choose how you want to interact with the AI interviewer
                    </FormDescription>
                    <Tabs
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text" className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Text Chat</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="voice" 
                          className="flex items-center space-x-2"
                          disabled={!audioSupported}
                        >
                          {audioSupported ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                          <span>Voice (Live)</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="text" className="mt-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              <span>Text-Based Interview</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Type your responses in a chat interface</p>
                            <p>• Get real-time feedback after each answer</p>
                            <p>• Perfect for detailed, thoughtful responses</p>
                            <p>• Works on all devices and network conditions</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="voice" className="mt-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center space-x-2">
                              <Mic className="h-4 w-4 text-primary" />
                              <span>Voice Interview (Gemini Live)</span>
                              <Badge variant="outline" className="text-xs">Beta</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Natural conversation with AI interviewer</p>
                            <p>• Low-latency, real-time audio streaming</p>
                            <p>• Practice verbal communication skills</p>
                            <p>• Automatic transcription included</p>
                            {!audioSupported && (
                              <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                                <p className="font-medium">⚠️ Microphone access required</p>
                                <p>Please allow microphone access to use voice mode.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Interview Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-muted-foreground">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Question Types */}
            <FormField
              control={form.control}
              name="questionTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Types</FormLabel>
                  <FormDescription>
                    Select the types of questions you want to practice
                  </FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {questionTypeOptions.map((option) => (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all hover:border-primary/50 ${
                          field.value.includes(option.value as QuestionType)
                            ? 'border-primary bg-primary/5'
                            : ''
                        }`}
                        onClick={() => {
                          const currentTypes = field.value;
                          const newTypes = currentTypes.includes(option.value as QuestionType)
                            ? currentTypes.filter(type => type !== option.value)
                            : [...currentTypes, option.value as QuestionType];
                          field.onChange(newTypes);
                        }}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{option.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Instructions */}
            <FormField
              control={form.control}
              name="customInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific areas you want to focus on or special requirements..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide additional context or specific topics you want the AI interviewer to focus on.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Starting Interview...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Start Interview</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}