"use client";

import React from "react";
import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    value: "10,000+",
    label: "Jobs Matched Daily",
    icon: TrendingUp,
  },
  {
    value: "95%",
    label: "Match Accuracy",
    icon: Sparkles,
  },
  {
    value: "3x",
    label: "Faster Job Search",
    icon: Zap,
  },
];

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Job Search
          </Badge>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            Ready to Find Your
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent">
              Dream Job?
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Join thousands of professionals who&apos;ve transformed their careers with our AI-powered job matching platform. 
            Start your journey to career success today.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-full">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-2 rounded-full" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-2 rounded-full" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-2 rounded-full" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full blur-xl animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <div className="w-32 h-32 bg-gradient-to-r from-accent to-chart-1 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
    </section>
  );
};
