import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  FileText,
  Bell,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Mic,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Resume Matching",
      description:
        "Our intelligent algorithm analyzes your resume and matches you with jobs that perfectly fit your skills, experience, and career goals.",
      benefits: [
        "Apply only to jobs you're qualified for",
        "Discover hidden opportunities based on your skills",
        "Get match percentage for each job",
        "Real-time job compatibility scoring",
      ],
      gradient: "from-chart-1 to-chart-2",
      badge: "Most Popular",
      cta: "Start Matching",
    },
    {
      icon: FileText,
      title: "Automated Application Tracking",
      description:
        "Never lose track of your applications again. Our AI organizes and monitors all your job applications with smart insights.",
      benefits: [
        "Automatic application status updates",
        "Follow-up reminders and suggestions",
        "Application performance analytics",
        "Interview scheduling assistance",
      ],
      gradient: "from-chart-2 to-chart-3",
      badge: "Time Saver",
      cta: "Track Applications",
    },
    {
      icon: Bell,
      title: "Personalized Job Alerts",
      description:
        "Get notified instantly when dream jobs are posted. Our AI learns your preferences and sends only relevant opportunities.",
      benefits: [
        "Smart filtering based on your profile",
        "Real-time notifications",
        "Customizable alert frequency",
        "Location and remote work preferences",
      ],
      gradient: "from-chart-3 to-chart-4",
      badge: "Smart Alerts",
      cta: "Set Alerts",
    },
    {
      icon: MessageSquare,
      title: "Instant Interview Prep",
      description:
        "Prepare for interviews with AI-generated questions, company insights, and personalized coaching tailored to each role.",
      benefits: [
        "Company-specific interview questions",
        "AI-powered mock interviews",
        "Personalized feedback and tips",
        "Industry trend insights",
      ],
      gradient: "from-chart-4 to-chart-5",
      badge: "Interview Ready",
      cta: "Start Prepping",
    },
    {
      icon: Mic,
      title: "AI Interview Simulator",
      description:
        "Experience realistic mock interviews with our AI interviewer that adapts to your responses and provides comprehensive feedback.",
      benefits: [
        "Interactive AI interviewer with follow-up questions",
        "Real-time speech analysis and clarity scoring",
        "Confidence and accuracy evaluation",
        "Detailed performance summary with improvement tips",
      ],
      gradient: "from-chart-5 to-chart-1",
      badge: "Live AI",
      cta: "Start Interview",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful AI Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-chart-2 to-chart-1 bg-clip-text text-transparent block sm:inline">
              {" "}
              Land Your Dream Job
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive AI platform streamlines every step of your job
            search journey, from finding the perfect match to acing the
            interview.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative bg-card border-border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {feature.badge}
                  </Badge>
                </div>

                <CardTitle className="text-2xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                  {feature.title}
                </CardTitle>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardHeader>

              <CardContent className="relative">
                {/* Benefits List */}
                <ul className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-chart-2 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-card-foreground text-sm">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full bg-gradient-to-r ${feature.gradient} text-white hover:opacity-90 transition-all duration-300 group-hover:shadow-lg`}
                >
                  <Link href="/register">
                    {feature.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>

              {/* Hover Effect Elements */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Zap className="w-6 h-6 text-chart-1 animate-pulse" />
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA - responsive */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-center sm:justify-between bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex justify-center sm:justify-start -space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-chart-2 to-chart-3 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-chart-3 to-chart-4 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <p className="font-semibold text-primary mb-1">
                Ready to supercharge your job search?
              </p>
              <p className="text-sm text-muted-foreground">
                Join thousands who found their dream jobs with ApplyMint AI
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-chart-2 to-chart-1 text-white hover:from-chart-2/90 hover:to-chart-1/90"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
