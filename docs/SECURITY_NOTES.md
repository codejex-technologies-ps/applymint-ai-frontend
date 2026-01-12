# Security Notes for API Simulation Scripts

## Understanding Supabase Keys

### Public (Anon) Key - Safe to Expose
The `SUPABASE_ANON_KEY` used in these scripts is the **anonymous/public key**. This key is:
- ✅ **Designed to be public** - It's meant to be included in frontend JavaScript
- ✅ **Protected by RLS** - Row Level Security policies control what it can access
- ✅ **Not a secret** - It's visible in your frontend code anyway
- ✅ **Read-only by default** - Can't modify data without proper authorization

### Service Role Key - NEVER Expose
The `SUPABASE_SERVICE_ROLE_KEY` is the **admin key**. This key:
- ❌ **Must be kept secret** - Never commit to version control
- ❌ **Has full database access** - Bypasses all RLS policies
- ❌ **Not used in these scripts** - Only the public anon key is used

## Script Security Model

### How the Scripts Handle Credentials

All scripts use this pattern:

```bash
# Read from environment first, fallback to default
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://pidjubyaqzoitmbixzbf.supabase.co}"
SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGc...}"
```

This means:
1. **First**: Try to use `NEXT_PUBLIC_SUPABASE_URL` from environment
2. **Fallback**: If not set, use the default value

### Why Fallbacks Are Included

The fallback values are included because:
- ✅ These are **test/simulation scripts**, not production code
- ✅ The values match the user's existing PowerShell scripts
- ✅ Makes scripts work "out of the box" for testing
- ✅ The anon key is public anyway (safe to hardcode)
- ✅ Convenience for demo and development

### Best Practices for Production Use

For production deployment:

#### Option 1: Use Environment Variables (Recommended)

Create `.env.local` in project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Scripts will automatically use these values.

#### Option 2: Export Variables

```bash
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

cd scripts
./run-complete-simulation.sh
```

#### Option 3: Edit Scripts

For your own Supabase project, update the fallback values in scripts to match your project.

## What's Protected by Row Level Security (RLS)

Even with the anon key, access is controlled by RLS policies:

### Protected Operations

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can only modify their own data
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Similar policies for:
- work_experiences (linked to user's resumes)
- skills (linked to user's resumes)
- job_applications (linked to user)
- saved_jobs (linked to user)
- job_alerts (linked to user)
```

### What the Anon Key CAN Do

With proper authentication (JWT token):
- ✅ Read own profile data
- ✅ Create/update own resume
- ✅ Add own skills and work experience
- ✅ Apply to jobs
- ✅ Save jobs
- ✅ Create job alerts

### What the Anon Key CANNOT Do

Even with the anon key:
- ❌ Access other users' private data
- ❌ Modify other users' profiles
- ❌ Delete jobs or companies
- ❌ Access admin functions
- ❌ Bypass RLS policies

## Security Checklist

Before deploying to production:

- [ ] Review RLS policies on all tables
- [ ] Test that users can't access other users' data
- [ ] Verify service role key is never exposed
- [ ] Check that authentication is required for sensitive operations
- [ ] Validate input on all endpoints
- [ ] Test error handling doesn't leak sensitive info
- [ ] Monitor function logs for suspicious activity

## Additional Security Measures

### Implemented in the Code

✅ **Authorization Checks**
```typescript
// Example from skills endpoint
const { data: { user } } = await supabaseClient.auth.getUser()
if (!user) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401
  })
}
```

✅ **Ownership Validation**
```typescript
// Example from skills endpoint
const { data: resume } = await supabaseClient
  .from('resumes')
  .select('user_id')
  .eq('id', skillData.resume_id)
  .eq('user_id', user.id)  // Verify ownership
  .single()
```

✅ **Input Validation**
```typescript
// Example from work-experiences endpoint
const requiredFields = ['resume_id', 'company', 'position', 'description', 'start_date']
for (const field of requiredFields) {
  if (!experienceData[field]) {
    return new Response(JSON.stringify({ 
      error: `${field} is required` 
    }), { status: 400 })
  }
}
```

## Summary

### For Testing/Development ✅
The scripts are safe to use as-is:
- Public anon key is not sensitive
- RLS policies protect user data
- Scripts only create test data
- No admin operations performed

### For Production 🔒
Follow these guidelines:
- Use environment variables for all credentials
- Implement RLS policies on all tables
- Test authorization thoroughly
- Never expose service role key
- Monitor for suspicious activity

## Questions?

**Q: Is it safe to commit the anon key?**  
A: Yes, the anon key is designed to be public. It's in your frontend code anyway.

**Q: What about the service role key?**  
A: NEVER commit or expose the service role key. It's not used in these scripts.

**Q: Should I change the default values in scripts?**  
A: For production, use environment variables instead of hardcoding.

**Q: How do I know my data is protected?**  
A: Test the RLS policies - try to access another user's data with the anon key.

## Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Understanding Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [API Keys Explained](https://supabase.com/docs/guides/api#api-keys)
