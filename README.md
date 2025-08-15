# ApplyMint AI Frontend

A modern, AI-powered job search platform built with Next.js 15, TypeScript, and Tailwind CSS. Transform your job search with AI-powered precision.

## 🚀 Features

### ✨ Homepage Components
- **Hero Section**: AI copilot messaging with stats and dashboard mockup
- **Features Section**: 4 main AI-powered capabilities with hover effects
- **How It Works**: Step-by-step process explanation with visual mockups
- **Testimonials**: User success stories with ratings and achievements
- **Pricing**: 3-tier pricing with FAQ section
- **CTA Section**: Final call-to-action with trust indicators

### 🎨 Design System
- **Semantic Color Variables**: Comprehensive color system with automatic dark mode
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Built on Shadcn/ui for consistency
- **Modern UI**: Gradient effects, hover animations, and glass morphism

### 🛠️ Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS with custom utilities
- **Components**: Shadcn/ui component library
- **Icons**: Lucide React icons
- **Theme**: Next-themes for dark/light mode

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with color variables
│   ├── layout.tsx               # Root layout with Navbar/Footer
│   └── page.tsx                 # Homepage using all components
├── components/
│   ├── homepage/                # Homepage-specific components
│   │   ├── hero-section.tsx     # Main hero with AI messaging
│   │   ├── features-section.tsx # 4 key features showcase
│   │   ├── how-it-works-section.tsx # Process explanation
│   │   ├── testimonials-section.tsx # User success stories
│   │   ├── pricing-section.tsx  # Pricing tiers and FAQ
│   │   ├── cta-section.tsx      # Final call-to-action
│   │   └── index.tsx            # Main homepage component
│   ├── layout/                  # Layout components
│   │   ├── navbar.tsx           # Navigation with branding
│   │   └── footer.tsx           # Site footer with links
│   ├── provider/                # Context providers
│   │   └── theme-provider.tsx   # Theme switching
│   └── ui/                      # Shadcn/ui base components
└── CODE_STYLE_GUIDE.md         # Comprehensive development guide
```

## 🎨 Color System

Our design uses semantic color variables that automatically support dark mode:

### Primary Colors
- `bg-primary` / `text-primary` - Main brand colors
- `bg-primary-foreground` / `text-primary-foreground` - Text on primary backgrounds

### UI Colors
- `bg-card` / `text-card-foreground` - Card backgrounds and text
- `bg-accent` / `text-accent-foreground` - Accent elements
- `bg-muted` / `text-muted-foreground` - Subdued content
- `bg-destructive` / `text-destructive-foreground` - Error states

### Chart Colors
- `bg-chart-1` through `bg-chart-5` - Data visualization
- Perfect for success, warning, and info states

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **View the Homepage**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Development Guidelines

### Component Creation
- Use TypeScript interfaces for all props
- Follow semantic color variables (never hardcoded colors)
- Implement responsive design with mobile-first approach
- Use Shadcn/ui components as foundation
- Export components as named exports

### Styling Best Practices
- Use semantic color variables: `bg-primary`, `text-muted-foreground`, etc.
- Create custom utility classes in `globals.css`
- Implement hover effects and animations
- Support both light and dark modes automatically

### Code Quality
- Follow ESLint and Prettier configurations
- Use descriptive component and variable names
- Implement proper TypeScript typing
- Write self-documenting code with clear structure

## 🌟 Component Highlights

### Hero Section
- AI copilot messaging with "Transform Your Job Search"
- Real-time stats (10K+ matches, 95% accuracy, 3x faster)
- Animated dashboard mockup with floating elements
- Gradient CTAs and trust indicators

### Features Section
- AI Job Matching with smart recommendations
- Automated Applications with one-click apply
- Resume Optimization with AI-powered improvements
- Interview Preparation with AI coaching

### Testimonials
- 6 success stories with authentic user experiences
- Company logos and achievement metrics
- Star ratings and specific outcome data
- Professional headshots with role/company info

### Pricing
- 3-tier structure: Starter (Free), Professional ($29), Enterprise ($99)
- Feature comparison with limitations clearly marked
- FAQ section addressing common concerns
- Trust indicators and money-back guarantee

## 🎯 Key Features Implemented

### ✅ Completed Features
- [x] Comprehensive color system with dark mode support
- [x] Responsive navigation with mobile menu
- [x] Hero section with AI messaging and stats
- [x] Features showcase with hover effects
- [x] Step-by-step process explanation
- [x] User testimonials with success metrics
- [x] 3-tier pricing with FAQ
- [x] Final CTA section with trust indicators
- [x] Site footer with comprehensive links
- [x] SEO-optimized metadata

### 🔮 Next Steps
- [ ] Add authentication system with NextAuth.js
- [ ] Implement job search functionality
- [ ] Create dashboard with user profile
- [ ] Add AI chat interface
- [ ] Build resume builder component
- [ ] Integrate with job search APIs
- [ ] Add analytics and tracking
- [ ] Implement email notifications

## 📋 Code Style Guide

Refer to `CODE_STYLE_GUIDE.md` for comprehensive development guidelines including:
- Component structure and naming conventions
- TypeScript best practices
- Semantic color usage examples
- State management patterns
- API integration guidelines
- Testing strategies

## 🎨 Brand Identity

### ApplyMint AI Brand
- **Primary Colors**: Mint green gradients with professional accents
- **Typography**: Modern, clean sans-serif fonts
- **Messaging**: "Transform Your Job Search with AI-Powered Precision"
- **Personality**: Professional, innovative, trustworthy, efficient

### Visual Elements
- Gradient backgrounds and buttons
- Floating animations and hover effects
- Glass morphism and backdrop blur
- Consistent spacing and border radius
- Professional iconography from Lucide

## 🔧 Technical Implementation

### Performance Optimizations
- Next.js 15 with Turbopack for fast builds
- Semantic color variables for consistent theming
- Component-based architecture for reusability
- Mobile-first responsive design
- Optimized images and icons

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader optimization

## 📞 Support

For questions about development or implementation, refer to the comprehensive `CODE_STYLE_GUIDE.md` or contact the development team.

---

**ApplyMint AI** - Transforming job search with AI-powered precision. Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
