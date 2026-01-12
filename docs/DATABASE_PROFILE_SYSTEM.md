# Database Profile System Documentation

## Overview

This project now uses a custom `profiles` table that extends Supabase authentication with additional user information. The profiles table is automatically synced with the auth system and provides a clean interface for managing user data.

## Database Schema

### Profiles Table Structure

```sql
create table public.profiles (
  id uuid not null,                                    -- References auth.users(id)
  email text not null,                                 -- User's email (synced from auth)
  first_name text null,                                -- User's first name
  last_name text null,                                 -- User's last name  
  phone_number text null,                              -- User's phone number
  created_at timestamp with time zone null default now(), -- Profile creation timestamp
  updated_at timestamp with time zone null default now(), -- Last update timestamp
  constraint profiles_pkey primary key (id),
  constraint profiles_email_key unique (email),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete CASCADE
)
```

### Key Features

- **Automatic Profile Creation**: When a user signs up, a profile is automatically created via database trigger
- **Email Sync**: Email is automatically synced from the auth system
- **Auto-updating Timestamps**: `updated_at` is automatically updated when the profile changes
- **Row Level Security**: Users can only access and modify their own profiles

## Setup Instructions

### 1. Database Setup

Run the SQL script in your Supabase SQL editor:

```bash
# Copy and paste the contents of supabase-setup.sql into your Supabase SQL editor
cat supabase-setup.sql
```

### 2. Environment Variables

Ensure your `.env.local` has the required Supabase configuration:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## TypeScript Interfaces

### Core Types

```typescript
// Raw database profile (matches DB schema exactly)
interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  created_at: string
  updated_at: string
}

// Frontend user object (computed from profile + auth data)
interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// Supabase auth user (for reference)
interface AuthUser {
  id: string
  email: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  role?: string
  created_at: string
  updated_at: string
}
```

## Usage Examples

### Using the Auth Context

```typescript
import { useAuth } from '@/components/auth/auth-provider'

function MyComponent() {
  const { user, profile, updateProfile, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>
  
  return (
    <div>
      <h1>Welcome, {user.firstName || 'User'}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber || 'Not provided'}</p>
    </div>
  )
}
```

### Updating Profile Data

```typescript
const handleUpdateProfile = async () => {
  const { error } = await updateProfile({
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '+1234567890'
  })
  
  if (error) {
    console.error('Failed to update profile:', error)
  } else {
    console.log('Profile updated successfully!')
  }
}
```

### Direct Profile Service Usage

```typescript
import { profilesService } from '@/lib/services/profiles'

// Get current user's profile
const profile = await profilesService.getCurrentProfile()

// Update profile
const updatedProfile = await profilesService.updateProfile({
  first_name: 'Jane',
  phone_number: '+1987654321'
})

// Get profile by ID (for viewing other users)
const otherProfile = await profilesService.getProfileById('user-id')

// Convert profile to User object
const user = profilesService.convertToUser(profile, true)
```

### Server-Side Usage

```typescript
import { serverProfilesService } from '@/lib/services/server-profiles'

// In a server component or API route
export default async function ServerComponent() {
  const profile = await serverProfilesService.getCurrentProfile()
  
  if (!profile) {
    return <div>No profile found</div>
  }
  
  return (
    <div>
      <h1>{profile.first_name} {profile.last_name}</h1>
      <p>{profile.email}</p>
    </div>
  )
}
```

## Registration Flow

When a user registers, the system:

1. Creates an auth user in `auth.users`
2. Automatically triggers profile creation in `public.profiles`
3. Populates `first_name` and `last_name` from registration metadata
4. Sets `email` from the auth user's email
5. User can later update their profile through the UI

### Registration Example

```typescript
// This data is passed to signUp
const metadata = {
  first_name: formData.firstName,
  last_name: formData.lastName
}

await signUp(email, password, metadata)
// Profile is automatically created with this data
```

## Database Triggers

### Profile Creation Trigger

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;
```

### Auto-Update Trigger

```sql
create trigger update_profiles_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION update_updated_at_column ();
```

## Security

### Row Level Security Policies

- **Read**: All profiles are viewable by everyone (for public profiles)
- **Insert**: Users can only create their own profile (handled by trigger)
- **Update**: Users can only update their own profile

### Policy Examples

```sql
-- Users can view all profiles (adjust as needed)
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Users can only update their own profile
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);
```

## Migration from Old Schema

If you had an old profiles table, you may need to migrate:

1. Backup existing data
2. Drop old table: `DROP TABLE IF EXISTS profiles CASCADE;`
3. Run the new setup script
4. Migrate data if needed

## Testing

Example test for profile functionality:

```typescript
describe('Profile System', () => {
  it('should create profile on user registration', async () => {
    const { user } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          first_name: 'John',
          last_name: 'Doe'
        }
      }
    })
    
    const profile = await profilesService.getCurrentProfile()
    expect(profile?.first_name).toBe('John')
    expect(profile?.last_name).toBe('Doe')
  })
})
```

## Troubleshooting

### Common Issues

1. **Profile not created**: Check if the trigger is properly installed
2. **Permission denied**: Verify RLS policies are correctly configured  
3. **Email mismatch**: Ensure email sync is working in the trigger
4. **Type errors**: Make sure you're using the correct TypeScript interfaces

### Debug Queries

```sql
-- Check if profile exists for user
SELECT * FROM profiles WHERE id = 'user-id';

-- Check trigger existence
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

This setup provides a robust, type-safe profile system that automatically stays in sync with Supabase authentication while providing the flexibility to store additional user information.