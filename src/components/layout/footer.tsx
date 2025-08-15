import React from 'react'
import Link from 'next/link'
import { Leaf, Github, Twitter, Linkedin, Instagram } from 'lucide-react'

export const Footer = () => {
  const footerSections = [
    {
      title: 'Features',
      links: [
        { label: 'AI Job Matching', href: '/features/job-matching' },
        { label: 'Resume Builder', href: '/features/resume-builder' },
        { label: 'Application Tracking', href: '/features/tracking' },
        { label: 'Interview Prep', href: '/features/interview-prep' },
        { label: 'Job Alerts', href: '/features/alerts' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Career Guide', href: '/resources/career-guide' },
        { label: 'Resume Templates', href: '/resources/templates' },
        { label: 'Interview Tips', href: '/resources/interview-tips' },
        { label: 'Success Stories', href: '/resources/success-stories' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Partners', href: '/partners' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
        { label: 'Cookie Policy', href: '/cookie-policy' },
        { label: 'CCPA', href: '/ccpa' },
        { label: 'GDPR', href: '/gdpr' },
      ],
    },
  ]

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/applymintai', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/applymint-ai', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/applymint.ai', label: 'Instagram' },
    { icon: Github, href: 'https://github.com/applymint-ai', label: 'GitHub' },
  ]

  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-chart-2 to-chart-1 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">ApplyMint AI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
              Transform your job search with AI-powered precision. Find and land your dream job
              faster, smarter, and stress-free with ApplyMint AI.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-primary font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} ApplyMint AI. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/status"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                System Status
              </Link>
              <Link
                href="/security"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Security
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <span className="text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
