"use client";

import React from "react";
import { HeroSection } from "@/components/homepage/hero-section";
import { FeaturesSection } from "@/components/homepage/features-section";
import { HowItWorksSection } from "@/components/homepage/how-it-works-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
import { PricingSection } from "@/components/homepage/pricing-section";
import { CTASection } from "@/components/homepage/cta-section";

export const Homepage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </main>
  );
};
