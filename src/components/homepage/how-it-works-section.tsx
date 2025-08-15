import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Upload, 
  Target, 
  Send, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: Upload,
      title: 'Upload Your Profile',
      description: 'Simply upload your resume and fill out your preferences. Our AI analyzes your skills, experience, and career goals.',
      details: [
        'Resume parsing and optimization',
        'Skills extraction and mapping',
        'Career preference analysis',
        'Profile strength assessment'
      ],
      time: '2 minutes',
      gradient: 'from-chart-1 to-chart-2'
    },
    {
      step: 2,
      icon: Target,
      title: 'AI Finds Perfect Matches',
      description: 'Our advanced AI scans thousands of job postings and identifies opportunities that perfectly match your profile.',
      details: [
        'Real-time job matching',
        'Compatibility score calculation',
        'Company culture fit analysis',
        'Growth opportunity assessment'
      ],
      time: 'Instant',
      gradient: 'from-chart-2 to-chart-3'
    },
    {
      step: 3,
      icon: Send,
      title: 'Apply with Confidence',
      description: 'Get personalized application recommendations, optimized cover letters, and insider company insights.',
      details: [
        'Automated application tracking',
        'Tailored cover letter generation',
        'Company insider connections',
        'Application status monitoring'
      ],
      time: '1 click',
      gradient: 'from-chart-3 to-chart-4'
    },
    {
      step: 4,
      icon: TrendingUp,
      title: 'Land Your Dream Job',
      description: 'Receive interview preparation, salary negotiation tips, and ongoing career guidance until you succeed.',
      details: [
        'AI-powered interview prep',
        'Salary negotiation guidance',
        'Follow-up recommendations',
        'Career growth planning'
      ],
      time: 'Ongoing',
      gradient: 'from-chart-4 to-chart-5'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent text-accent-foreground border-accent/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            How ApplyMint AI 
            <span className="bg-gradient-to-r from-chart-2 to-chart-1 bg-clip-text text-transparent block sm:inline">
              {' '}Transforms Your Job Search
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From profile creation to job offer - our AI guides you through every step 
            of your career journey with personalized insights and recommendations.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-1 h-24 bg-gradient-to-b from-chart-2 to-chart-3 rounded-full hidden lg:block"></div>
              )}
              
              <div className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content Card */}
                <div className="flex-1">
                  <Card className="bg-card border-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mr-4`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
                            Step {step.step}
                          </Badge>
                          <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        {step.description}
                      </p>

                      {/* Feature List */}
                      <ul className="space-y-3 mb-6">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                            <span className="text-card-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Time Badge */}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Takes {step.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Element */}
                <div className="flex-1 max-w-md">
                  <div className={`relative bg-gradient-to-r ${step.gradient} rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500`}>
                    {/* Mock Interface */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                          <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                          <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                        </div>
                        <div className="text-sm font-medium">Step {step.step}</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-4 bg-white/40 rounded-lg"></div>
                        <div className="h-4 bg-white/30 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-white/30 rounded-lg w-1/2"></div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-center">
                        <step.icon className="w-12 h-12 text-white/80" />
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Start Your AI-Powered Job Search?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful job seekers who transformed their careers with ApplyMint AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                asChild
                className="bg-gradient-to-r from-chart-2 to-chart-1 text-white hover:from-chart-2/90 hover:to-chart-1/90 px-8"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Setup in 2 minutes • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
