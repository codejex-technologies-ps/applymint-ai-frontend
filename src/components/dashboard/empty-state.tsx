'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Search, 
  Target, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  FileText,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  className?: string;
}

export function DashboardEmptyState({ className }: EmptyStateProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Message */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to ApplyMint AI! 🎉
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Let&apos;s get you started on your AI-powered job search journey. 
            Here are some quick steps to maximize your success.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Target className="h-4 w-4 mr-2" />
            Take the Dashboard Tour
          </Button>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <span>1. Upload Your Resume</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload your resume to get personalized job recommendations and let our AI analyze your skills.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">
                <FileText className="h-4 w-4 mr-2" />
                Upload Resume
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>2. Explore Jobs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Browse thousands of job opportunities and see AI-powered match scores for each position.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/jobs">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>3. Practice Interviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use our AI interview simulator to practice and improve your interview skills with personalized feedback.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/interview-practice">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Practice
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>4. Set Up Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create job alerts based on your preferences and never miss out on perfect opportunities.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/job-alerts">
                <Target className="h-4 w-4 mr-2" />
                Create Alerts
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Preview */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your Progress Will Appear Here
            </h3>
            <p className="text-muted-foreground text-sm">
              Once you start applying to jobs, you&apos;ll see comprehensive analytics and insights about your job search.
            </p>
          </div>
          
          {/* Preview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border border-dashed border-muted-foreground/30">
              <div className="text-2xl font-bold text-muted-foreground/50">0</div>
              <div className="text-sm text-muted-foreground">Jobs Applied</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-dashed border-muted-foreground/30">
              <div className="text-2xl font-bold text-muted-foreground/50">0</div>
              <div className="text-sm text-muted-foreground">Interviews</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-dashed border-muted-foreground/30">
              <div className="text-2xl font-bold text-muted-foreground/50">--</div>
              <div className="text-sm text-muted-foreground">Match Score</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-dashed border-muted-foreground/30">
              <div className="text-2xl font-bold text-muted-foreground/50">--%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete your profile to get better job matches</li>
                <li>• Use the AI interview practice to boost your confidence</li>
                <li>• Set up job alerts to stay ahead of the competition</li>
                <li>• Check your dashboard regularly for new opportunities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}