# ApplyMint AI - Quick Setup Script

This script will help you quickly set up your ApplyMint AI frontend with all the necessary dependencies and configurations.

## Automated Setup

Run this single command to install all dependencies:

```bash
# Install all dependencies at once
pnpm add lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-slot react-hook-form @hookform/resolvers zod next-auth zustand @tailwindcss/typography tailwindcss-animate && pnpm add -D @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier
```

## Manual Setup (Alternative)

If you prefer to install dependencies step by step:

### Core UI Dependencies
```bash
pnpm add lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

### Form and Validation
```bash
pnpm add react-hook-form @hookform/resolvers zod
```

### Authentication
```bash
pnpm add next-auth
```

### State Management
```bash
pnpm add zustand
```

### Styling Enhancements
```bash
pnpm add @tailwindcss/typography tailwindcss-animate
```

### Development Dependencies
```bash
pnpm add -D @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier
```

## Updated Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

## Post-Installation Steps

1. **Initialize Shadcn/ui**:
   ```bash
   pnpm dlx shadcn@latest init
   ```

2. **Install Shadcn/ui Components**:
   ```bash
   pnpm dlx shadcn@latest add button card badge input label dialog dropdown-menu form select textarea toast avatar separator skeleton
   ```

3. **Update Tailwind Config** (see SETUP_GUIDE.md for full configuration)

4. **Update Global CSS** (see SETUP_GUIDE.md for CSS variables)

5. **Configure TypeScript paths** in `tsconfig.json`:
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

## File Structure Created

The following directories have been created following our style guide:

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   ├── (legal)/
│   │   └── privacy-policy/
│   └── (public)/
├── components/
│   ├── ui/           # Shadcn/ui components will go here
│   ├── auth/
│   ├── dashboard/
│   ├── jobs/
│   ├── profile/
│   └── layout/
├── lib/              # Contains utils.ts
├── hooks/
└── types/            # Contains index.ts with type definitions
```

## Example Files Created

- `CODE_STYLE_GUIDE.md` - Comprehensive style guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `src/lib/utils.ts` - Utility functions
- `src/types/index.ts` - TypeScript type definitions
- `src/components/jobs/job-card.tsx` - Example component following style guide
- `src/app/(auth)/login/page.tsx` - Example auth page
- `src/app/(legal)/privacy-policy/page.tsx` - Example legal page

## Next Steps

1. Follow the SETUP_GUIDE.md for complete configuration
2. Start implementing authentication
3. Build out the dashboard components
4. Implement job search functionality
5. Add state management with Zustand
6. Set up API integration

## Important Notes

- All components use TypeScript with proper type definitions
- Shadcn/ui is used as the base component library
- Tailwind CSS with custom utility classes for styling
- Mobile-first responsive design approach
- Proper error handling and loading states
- SEO-optimized with Next.js metadata API
