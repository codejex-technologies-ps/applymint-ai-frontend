# ApplyMint AI Authentication Setup Guide

## Overview

This guide provides instructions for setting up and configuring the Supabase authentication system in the ApplyMint AI frontend application.

## Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Navigate to Settings > API
4. Copy the Project URL and anon public key

## Authentication Features

### ✅ Implemented
- **Login Form** (`/login`) - Email/password authentication with validation
- **Register Form** (`/register`) - User registration with password requirements
- **Protected Routes** - Dashboard and other protected pages require authentication
- **Dynamic Navigation** - Different nav states for authenticated/unauthenticated users
- **Password Validation** - Real-time password strength checking
- **Email Verification** - Built-in email verification flow
- **Error Handling** - Comprehensive error messages and loading states
- **Responsive Design** - Works perfectly on all screen sizes

### 🔄 Ready to Configure
- **Social Authentication** - Google and GitHub buttons are ready (disabled by default)
- **Password Reset** - Infrastructure in place for forgot password flow
- **Email Templates** - Ready for Supabase email template customization

## File Structure

```
src/
├── components/auth/
│   ├── auth-provider.tsx       # Authentication context provider
│   ├── login-form.tsx          # Login form component
│   └── register-form.tsx       # Registration form component
├── lib/supabase/
│   ├── client.ts               # Browser client configuration
│   ├── server.ts               # Server client configuration
│   └── middleware.ts           # Middleware helper functions
├── app/(auth)/
│   ├── login/page.tsx          # Login page
│   └── register/page.tsx       # Register page
└── app/(dashboard)/
    └── dashboard/page.tsx      # Protected dashboard example
```

## Usage

### Using the Auth Context

```typescript
import { useAuth } from '@/components/auth/auth-provider'

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }
  
  return <div>Please sign in</div>
}
```

### Protected Routes

Routes starting with `/dashboard` are automatically protected by middleware. Unauthenticated users will be redirected to `/login`.

### Social Authentication

To enable social authentication, update the disabled social login buttons in the login and register forms, and configure OAuth providers in your Supabase project.

## Supabase Database Setup

### User Profiles Table (Optional)

You may want to create a profiles table to store additional user information:

```sql
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Set up automatic profile creation
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Email Templates

Configure email templates in your Supabase dashboard for:
- Email verification
- Password reset
- Magic link authentication (if enabled)

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Row Level Security**: Enable RLS on all user-related tables
3. **Email Verification**: Ensure email verification is enabled in Supabase Auth settings
4. **Password Policy**: Configure password requirements in Supabase Auth settings

## Testing

To test the authentication flow:

1. Start the development server: `pnpm dev`
2. Navigate to `/register` to create a test account
3. Check your email for verification (if enabled)
4. Navigate to `/login` to sign in
5. Try accessing `/dashboard` to test protected routes

## Troubleshooting

### Common Issues

1. **"Missing environment variables" error**: Ensure `.env.local` is created with correct Supabase credentials
2. **"Network error" during auth**: Check if your Supabase URL and keys are correct
3. **Redirect loops**: Verify middleware configuration and ensure proper route protection
4. **Email not sending**: Check Supabase Auth settings and email provider configuration

### Debug Mode

To enable debug logging, add to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## Next Steps

1. Configure your Supabase project with the appropriate settings
2. Set up email templates for verification and password reset
3. Test the authentication flow thoroughly
4. Configure social authentication providers if needed
5. Implement user profile management features
6. Add role-based access control if required

For more information, refer to the [Supabase Documentation](https://supabase.com/docs) and the [Next.js Integration Guide](https://supabase.com/docs/guides/auth/quickstarts/nextjs).