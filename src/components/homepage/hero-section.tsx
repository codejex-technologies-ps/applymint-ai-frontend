'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Target, Zap, Users } from 'lucide-react'

export const HeroSection = () => {
  const stats = [
    { value: '10,000+', label: 'Jobs Matched Daily' },
    { value: '95%', label: 'Success Rate' },
    { value: '50%', label: 'Faster Job Search' },
    { value: '24/7', label: 'AI Support' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-chart-2/5 py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-chart-2/5 via-transparent to-chart-1/5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-chart-2/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Announcement Badge */}
          <Badge 
            variant="outline" 
            className="mb-8 bg-card/50 text-primary border-primary/20 hover:bg-primary/10 transition-colors duration-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New: AI-Powered Interview Prep Now Available
            <ArrowRight className="w-4 h-4 ml-2" />
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-primary">Transform Your</span>
            <br />
            <span className="bg-gradient-to-r from-chart-2 to-chart-1 bg-clip-text text-transparent">
              Job Search
            </span>
            <br />
            <span className="text-primary">with AI-Powered Precision</span>
          </h1>

          {/* Sub-heading */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            ApplyMint AI helps you find and land your dream job—faster, smarter, and stress-free. 
            Let our advanced AI be your personal career copilot.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-chart-2 to-chart-1 text-white hover:from-chart-2/90 hover:to-chart-1/90 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
            >
              <Link href="/register">
                Start Your AI Job Search
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-6 text-lg"
            >
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Visual Elements */}
          <div className="relative max-w-4xl mx-auto">
            {/* AI Copilot Illustration */}
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-chart-2 to-chart-1 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">AI Copilot Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Your personal job search assistant</p>
                  </div>
                </div>
                <Badge className="bg-chart-2 text-white">Live</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-chart-1" />
                    <span className="font-medium text-primary">Jobs Matched</span>
                  </div>
                  <div className="text-2xl font-bold text-chart-1">47</div>
                  <div className="text-sm text-muted-foreground">+12 today</div>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-chart-2" />
                    <span className="font-medium text-primary">Match Score</span>
                  </div>
                  <div className="text-2xl font-bold text-chart-2">94%</div>
                  <div className="text-sm text-muted-foreground">Excellent fit</div>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-chart-4" />
                    <span className="font-medium text-primary">Connections</span>
                  </div>
                  <div className="text-2xl font-bold text-chart-4">8</div>
                  <div className="text-sm text-muted-foreground">Potential referrals</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-chart-1 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
