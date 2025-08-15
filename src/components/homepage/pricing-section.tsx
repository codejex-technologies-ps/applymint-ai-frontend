"use client";

import React from "react";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started with AI-powered job search",
    features: [
      "5 AI job matches per day",
      "Basic resume optimization",
      "Job application tracking",
      "Email notifications",
      "Standard support",
    ],
    limitations: ["Limited to 20 applications per month", "Basic AI insights"],
    cta: "Get Started Free",
    popular: false,
    icon: Star,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Accelerate your job search with advanced AI features",
    features: [
      "Unlimited AI job matches",
      "Advanced resume optimization",
      "AI-powered cover letters",
      "Interview preparation",
      "Application auto-fill",
      "Priority support",
      "Advanced analytics",
      "Salary negotiation tips",
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: true,
    icon: Zap,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "Complete AI job search solution for serious professionals",
    features: [
      "Everything in Professional",
      "Personal AI job coach",
      "Executive job opportunities",
      "Direct recruiter connections",
      "Custom job alerts",
      "Career path planning",
      "White-glove support",
      "API access",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    icon: Crown,
  },
];

const faqItems = [
  {
    question: "How does the AI job matching work?",
    answer:
      "Our AI analyzes your resume, skills, experience, and preferences to match you with relevant job opportunities. It learns from your feedback to improve matches over time.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade security measures to protect your personal information and job search data. Your data is encrypted and never shared without your consent.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.",
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Pricing Plans
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Success Plan
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade as your job search accelerates. All plans
            include our core AI matching technology.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-accent"
                          : "bg-accent/10"
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${
                          plan.popular
                            ? "text-primary-foreground"
                            : "text-accent"
                        }`}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Check className="h-4 w-4 text-chart-2" />
                        </div>
                        <span className="text-sm text-card-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Plan limitations:
                      </p>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0 mt-2" />
                            <span className="text-xs text-muted-foreground">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground">
              Got questions? We&#39;ve got answers. Can&#39;t find what
              you&#39;re looking for?
              <a
                href="/contact"
                className="text-primary hover:text-primary/80 ml-1"
              >
                Contact our support team
              </a>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((faq, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-primary mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Transform Your Job Search?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who&#39;ve accelerated their
              careers with AI-powered job matching. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
              >
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
