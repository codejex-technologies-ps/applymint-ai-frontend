import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service - ApplyMint AI",
  description: "Terms of Service for ApplyMint AI job search platform. Learn about our terms and conditions for using our AI-powered job matching service.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using ApplyMint AI's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site and our services.`,
  },
  {
    id: "description",
    title: "2. Service Description",
    content: `ApplyMint AI is an AI-powered job search platform that provides:
    • Intelligent job matching based on your profile and preferences
    • Automated job application assistance
    • Resume optimization recommendations
    • Interview preparation resources
    • Career insights and analytics
    
    Our AI technology analyzes job postings and your professional profile to provide personalized job recommendations and career guidance.`,
  },
  {
    id: "user-accounts",
    title: "3. User Accounts",
    content: `To access certain features of our service, you must create an account. You are responsible for:
    • Providing accurate and complete information
    • Maintaining the security of your account credentials
    • All activities that occur under your account
    • Immediately notifying us of any unauthorized use
    
    You must be at least 18 years old to create an account. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use Policy",
    content: `You agree not to:
    • Use the service for any unlawful purpose or in violation of any laws
    • Submit false, misleading, or fraudulent information
    • Interfere with or disrupt the service or servers
    • Attempt to gain unauthorized access to any systems
    • Use automated scripts or bots without permission
    • Harass, abuse, or harm other users
    • Violate any intellectual property rights
    • Upload malicious code or viruses`,
  },
  {
    id: "ai-services",
    title: "5. AI-Powered Services",
    content: `Our AI technology is designed to assist with job searching but:
    • AI recommendations are suggestions, not guarantees
    • Job match accuracy may vary based on available data
    • Users remain responsible for their application decisions
    • We continuously improve our algorithms but cannot guarantee perfect matches
    • Final hiring decisions are made by employers, not our AI system`,
  },
  {
    id: "data-usage",
    title: "6. Data Usage and Privacy",
    content: `By using our service, you acknowledge that:
    • We collect and process your data as described in our Privacy Policy
    • Your resume and profile data will be used to improve job matching
    • Anonymized data may be used to enhance our AI algorithms
    • You can control your data sharing preferences in your account settings
    • We implement industry-standard security measures to protect your information`,
  },
  {
    id: "job-applications",
    title: "7. Job Applications",
    content: `When using our application assistance features:
    • You authorize us to submit applications on your behalf
    • You are responsible for the accuracy of submitted information
    • You can review applications before submission when possible
    • We are not responsible for employer responses or hiring decisions
    • Some applications may be automatically submitted based on your preferences`,
  },
  {
    id: "subscription",
    title: "8. Subscription and Billing",
    content: `For paid services:
    • Subscriptions automatically renew unless cancelled
    • You can cancel anytime through your account settings
    • Refunds are provided according to our refund policy
    • Price changes will be communicated 30 days in advance
    • Failure to pay may result in service suspension
    • Free trial users will be charged unless they cancel before trial end`,
  },
  {
    id: "intellectual-property",
    title: "9. Intellectual Property",
    content: `ApplyMint AI and its content are protected by intellectual property laws:
    • Our platform, algorithms, and content are proprietary
    • You retain ownership of your personal data and resume content
    • You grant us license to use your data to provide services
    • Third-party content remains the property of respective owners
    • You may not copy, modify, or distribute our proprietary technology`,
  },
  {
    id: "disclaimers",
    title: "10. Disclaimers and Limitations",
    content: `Our service is provided "as is" without warranties:
    • We do not guarantee job placement or interview success
    • AI recommendations are based on available data and algorithms
    • Job market conditions and employer preferences may affect results
    • Third-party job postings may contain inaccurate information
    • Service availability may be interrupted for maintenance or technical issues`,
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    content: `To the maximum extent permitted by law:
    • Our liability is limited to the amount you paid for our services
    • We are not liable for indirect, incidental, or consequential damages
    • We are not responsible for third-party actions or content
    • Users assume responsibility for their career and application decisions
    • Some jurisdictions do not allow liability limitations, so these may not apply to you`,
  },
  {
    id: "termination",
    title: "12. Termination",
    content: `Either party may terminate the service relationship:
    • You can delete your account at any time
    • We may suspend or terminate accounts for terms violations
    • Upon termination, your access to paid features will cease
    • Data retention is governed by our Privacy Policy
    • Some provisions of these terms survive termination`,
  },
  {
    id: "governing-law",
    title: "13. Governing Law",
    content: `These terms are governed by the laws of [Your Jurisdiction]:
    • Disputes will be resolved through binding arbitration when possible
    • You waive the right to participate in class action lawsuits
    • Courts in [Your Jurisdiction] have exclusive jurisdiction
    • If any provision is invalid, the remainder remains enforceable`,
  },
  {
    id: "changes",
    title: "14. Changes to Terms",
    content: `We may update these terms periodically:
    • Changes will be posted on this page with an updated date
    • Significant changes will be communicated via email
    • Continued use after changes constitutes acceptance
    • We encourage you to review terms regularly`,
  },
  {
    id: "contact",
    title: "15. Contact Information",
    content: `For questions about these terms, contact us at:
    • Email: legal@applymint.ai
    • Address: [Your Business Address]
    • Phone: [Your Contact Number]
    
    We will respond to inquiries within 5 business days.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Legal
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These terms govern your use of ApplyMint AI's job search platform and services.
              Please read them carefully.
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Last updated: August 15, 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary">Important Notice</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-card-foreground">
              <p>
                Welcome to ApplyMint AI! These Terms of Service ("Terms") constitute a legally binding 
                agreement between you and ApplyMint AI regarding your use of our AI-powered job search 
                platform and related services.
              </p>
              <p className="text-muted-foreground text-sm mt-4">
                By using our service, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms and our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={section.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary" id={section.id}>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-card-foreground">
                    {section.content.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-4 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
                {index < sections.length - 1 && (
                  <Separator className="border-border" />
                )}
              </Card>
            ))}
          </div>

          {/* Footer Notice */}
          <Card className="mt-12 bg-accent/10 border-accent/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-primary mb-2">
                  Questions About These Terms?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  If you have any questions about these Terms of Service, please contact our legal team.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                  <a href="mailto:legal@applymint.ai" className="text-primary hover:text-primary/80">
                    legal@applymint.ai
                  </a>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <a href="/contact" className="text-primary hover:text-primary/80">
                    Contact Support
                  </a>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <a href="/privacy-policy" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
