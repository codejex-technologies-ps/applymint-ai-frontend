# ApplyMint AI Frontend Setup Guide

This guide will help you set up the ApplyMint AI frontend application following our code style guide.

## Prerequisites

- Node.js 18+ 
- PNPM (already configured)
- Git

## Installation Steps

### 1. Install Dependencies

First, install the required dependencies for Shadcn/ui and other libraries:

```bash
# Install Shadcn/ui CLI
pnpm dlx shadcn@latest init

# Install additional dependencies
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm add react-hook-form @hookform/resolvers zod
pnpm add next-auth
pnpm add zustand
pnpm add @radix-ui/react-slot

# Development dependencies
pnpm add -D @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

### 2. Initialize Shadcn/ui Components

Install the base UI components:

```bash
# Install base components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add skeleton
```

### 3. Configure Path Aliases

Ensure your `tsconfig.json` includes the following path mapping:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4. Update Tailwind Configuration

Add the following to your `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### 5. Add CSS Variables

Update your `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom utility classes */
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
  
  .card-hover {
    @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
  }
  
  .skeleton {
    @apply animate-pulse bg-gray-200 dark:bg-gray-700 rounded;
  }

  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}
```

### 6. Configure ESLint and Prettier

Create `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prettier/prettier": "error"
  }
}
```

Create `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## Project Structure Implementation

After following the installation steps, your project structure should look like this:

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── jobs/             # Job-related components
│   ├── profile/          # Profile components
│   ├── layout/           # Layout components
│   └── common/           # Shared components
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── styles/               # Additional styles
```

## Development Workflow

1. **Start Development Server**:
   ```bash
   pnpm dev
   ```

2. **Format Code**:
   ```bash
   pnpm format
   ```

3. **Lint Code**:
   ```bash
   pnpm lint
   ```

4. **Type Check**:
   ```bash
   pnpm type-check
   ```

## Key Principles

1. **Always use TypeScript** - Define proper interfaces for all props and data
2. **Use Shadcn/ui components** - Build upon the design system
3. **Follow naming conventions** - Use kebab-case for files, PascalCase for components
4. **Implement proper error handling** - Use error boundaries and loading states
5. **Write responsive designs** - Mobile-first approach with Tailwind CSS
6. **Optimize performance** - Use React.memo, lazy loading, and Next.js optimizations

## Next Steps

1. Set up authentication with NextAuth.js
2. Implement the dashboard layout
3. Create job search functionality
4. Build user profile management
5. Add state management with Zustand
6. Implement API integration
7. Add testing with Jest and React Testing Library

## Resources

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Hook Form Documentation](https://react-hook-form.com/)
