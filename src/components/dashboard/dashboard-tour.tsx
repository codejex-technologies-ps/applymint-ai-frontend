'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ApplyMint AI! 🎉',
    description: 'Let\'s take a quick tour of your AI-powered job search dashboard. This will only take a minute!',
    target: '.dashboard-header',
    position: 'bottom',
  },
  {
    id: 'stats',
    title: 'Your Job Search Progress',
    description: 'Track your applications, interviews, and match scores all in one place. These stats update automatically as you use the platform.',
    target: '.stats-overview',
    position: 'bottom',
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'Access the most common tasks quickly - apply to jobs, upload your resume, or start an AI interview practice session.',
    target: '.quick-actions',
    position: 'top',
  },
  {
    id: 'activity',
    title: 'Recent Activity',
    description: 'See your latest job applications, saved positions, and other activities. This helps you stay organized and track your progress.',
    target: '.activity-feed',
    position: 'top',
  },
  {
    id: 'recommendations',
    title: 'AI Job Recommendations',
    description: 'Our AI analyzes your profile and suggests the best job matches for you. The higher the match score, the better the fit!',
    target: '.job-recommendations',
    position: 'left',
  },
  {
    id: 'complete',
    title: 'You\'re all set! 🚀',
    description: 'You can always access help and tutorials from the menu. Ready to start your AI-powered job search?',
    target: '.dashboard-header',
    position: 'bottom',
  },
];

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function DashboardTour({ isOpen, onClose, onComplete }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const currentStepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  // Highlight the target element
  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const element = document.querySelector(currentStepData.target);
    if (element) {
      setHighlightedElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('tour-highlight');
    }

    return () => {
      if (element) {
        element.classList.remove('tour-highlight');
      }
    };
  }, [isOpen, currentStep, currentStepData]);

  // Add tour highlight styles
  useEffect(() => {
    if (!isOpen) return;

    const style = document.createElement('style');
    style.textContent = `
      .tour-highlight {
        position: relative;
        z-index: 1001;
        border-radius: 8px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2000px rgba(0, 0, 0, 0.5) !important;
        animation: tour-pulse 2s infinite;
      }
      
      @keyframes tour-pulse {
        0%, 100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 2000px rgba(0, 0, 0, 0.5); }
        50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.7), 0 0 0 2000px rgba(0, 0, 0, 0.5); }
      }
      
      .tour-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        pointer-events: none;
      }
      
      .tour-card {
        position: fixed;
        z-index: 1002;
        max-width: 360px;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isOpen]);

  const nextStep = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = highlightedElement.getBoundingClientRect();
    const tooltipWidth = 360;
    const tooltipHeight = 200;
    const padding = 20;

    let top = 0;
    let left = 0;
    let transform = '';

    switch (currentStepData.position) {
      case 'top':
        top = rect.top - tooltipHeight - padding;
        left = rect.left + (rect.width / 2);
        transform = 'translateX(-50%)';
        break;
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + (rect.width / 2);
        transform = 'translateX(-50%)';
        break;
      case 'left':
        top = rect.top + (rect.height / 2);
        left = rect.left - tooltipWidth - padding;
        transform = 'translateY(-50%)';
        break;
      case 'right':
        top = rect.top + (rect.height / 2);
        left = rect.right + padding;
        transform = 'translateY(-50%)';
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < padding) left = padding;
    if (left + tooltipWidth > viewportWidth - padding) left = viewportWidth - tooltipWidth - padding;
    if (top < padding) top = padding;
    if (top + tooltipHeight > viewportHeight - padding) top = viewportHeight - tooltipHeight - padding;

    return { top: `${top}px`, left: `${left}px`, transform };
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" />
      
      {/* Tour Card */}
      <Card className="tour-card" style={getTooltipPosition()}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-colors',
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Tour
            </Button>
            
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {isLastStep ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}