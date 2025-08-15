import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Headphones,
  FileText,
  Users,
  Sparkles,
  Send
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - ApplyMint AI",
  description: "Get in touch with ApplyMint AI. Contact our support team, sales, or partnership inquiries. We're here to help with your AI-powered job search journey.",
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help with your account or technical issues",
    contact: "support@applymint.ai",
    responseTime: "Usually responds within 2-4 hours",
    action: "Send Email",
    href: "mailto:support@applymint.ai"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Available 24/7",
    responseTime: "Instant response during business hours",
    action: "Start Chat",
    href: "#chat"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support specialists",
    contact: "+1 (555) 123-4567",
    responseTime: "Mon-Fri, 9 AM - 6 PM PST",
    action: "Call Now",
    href: "tel:+15551234567"
  }
];

const departments = [
  {
    icon: Headphones,
    title: "Technical Support",
    description: "Help with platform features, bugs, and account issues",
    email: "support@applymint.ai"
  },
  {
    icon: Users,
    title: "Sales & Partnerships",
    description: "Enterprise solutions and partnership opportunities",
    email: "sales@applymint.ai"
  },
  {
    icon: FileText,
    title: "Media & Press",
    description: "Press inquiries and media resources",
    email: "press@applymint.ai"
  },
  {
    icon: Mail,
    title: "General Inquiries",
    description: "Questions about our services and company",
    email: "hello@applymint.ai"
  }
];

const faqs = [
  {
    question: "How does the AI job matching work?",
    answer: "Our AI analyzes your resume, skills, and preferences to match you with relevant opportunities using advanced machine learning algorithms."
  },
  {
    question: "Is ApplyMint AI free to use?",
    answer: "We offer a free tier with basic features. Premium plans unlock advanced AI capabilities and unlimited job applications."
  },
  {
    question: "How secure is my personal data?",
    answer: "We use enterprise-grade security measures and never share your data without explicit consent. View our Privacy Policy for details."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll retain access to premium features until the end of your billing period."
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Get in Touch with
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about ApplyMint AI? Need help with your job search? 
              We're here to support you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gradient-to-r from-primary to-accent rounded-full">
                        <IconComponent className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <CardTitle className="text-primary">{method.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{method.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold text-primary">{method.contact}</p>
                      <p className="text-sm text-muted-foreground">{method.responseTime}</p>
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                    >
                      <a href={method.href}>{method.action}</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Send Message
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Drop Us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          First Name *
                        </label>
                        <Input 
                          type="text" 
                          required 
                          className="bg-background border-border focus:border-primary focus:ring-primary/20"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Last Name *
                        </label>
                        <Input 
                          type="text" 
                          required 
                          className="bg-background border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Email Address *
                      </label>
                      <Input 
                        type="email" 
                        required 
                        className="bg-background border-border focus:border-primary focus:ring-primary/20"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Subject *
                      </label>
                      <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:border-primary focus:ring-primary/20 text-card-foreground">
                        <option value="">Select a topic</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="partnership">Partnership</option>
                        <option value="press">Media & Press</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Message *
                      </label>
                      <textarea 
                        rows={5}
                        required
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:border-primary focus:ring-primary/20 text-card-foreground resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        id="privacy" 
                        required
                        className="mt-1"
                      />
                      <label htmlFor="privacy" className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="/privacy-policy" className="text-primary hover:text-primary/80">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="/terms-of-service" className="text-primary hover:text-primary/80">
                          Terms of Service
                        </a>
                      </label>
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Contact Info
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Other Ways to Reach Us
                </h2>
                <p className="text-muted-foreground">
                  Choose the contact method that works best for you.
                </p>
              </div>

              {/* Departments */}
              <div className="space-y-6 mb-8">
                {departments.map((dept, index) => {
                  const IconComponent = dept.icon;
                  return (
                    <Card key={index} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-primary mb-1">
                              {dept.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {dept.description}
                            </p>
                            <a 
                              href={`mailto:${dept.email}`}
                              className="text-sm text-accent hover:text-accent/80 font-medium"
                            >
                              {dept.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Office Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Our Office
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-card-foreground font-medium">ApplyMint AI Headquarters</p>
                    <p className="text-muted-foreground text-sm">
                      123 Innovation Drive<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Monday - Friday: 9:00 AM - 6:00 PM PST</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about ApplyMint AI.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@applymint.ai">Contact Support</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to Start Your Job Search?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've found their dream jobs with ApplyMint AI. 
            Get started today with our free plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
