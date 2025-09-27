# 🔧 Supabase Authentication Troubleshooting Guide

## 🚨 Issue Summary

Users experiencing authentication problems where:
- ✅ Users are created in `auth.users` table
- ❌ Users do NOT receive verification emails  
- ❌ Users do NOT receive magic login links
- ❌ Users are NOT created in the `profiles` table

## 🔍 Root Cause Analysis

Based on the codebase analysis, the issues are likely caused by:

1. **Database Trigger Issues**: Profile creation trigger may not be properly installed or configured
2. **Email Configuration**: Supabase email settings not properly configured
3. **RLS Policy Issues**: Row Level Security policies may be blocking operations
4. **Environment Configuration**: Missing or incorrect environment variables

## 🛠️ Step-by-Step Resolution

### Step 1: Verify Environment Configuration

1. **Check Environment Variables**
   ```bash
   # Verify these are set in your .env.local file
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Test Environment Setup**
   - Navigate to `/auth-debug` in your application
   - Run the diagnostics to verify configuration

### Step 2: Database Setup & Trigger Installation

1. **Run Enhanced Database Setup**
   - Open your Supabase Dashboard
   - Go to SQL Editor
   - Run the `supabase-setup-enhanced.sql` script
   - This script includes better error handling and debugging

2. **Verify Database Trigger**
   ```sql
   -- Check if trigger exists
   SELECT trigger_name, event_object_table, action_statement
   FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';

   -- Test profile creation function
   SELECT test_profile_creation();
   ```

3. **Check RLS Policies**
   ```sql
   -- Verify RLS policies exist
   SELECT tablename, policyname, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'profiles';
   ```

### Step 3: Email Configuration

1. **Supabase Dashboard Configuration**
   - Go to Authentication → Settings
   - Check "Email" section:
     - **Enable email confirmations**: ON
     - **Enable email change confirmations**: ON
     - **Secure email change**: ON (recommended)

2. **SMTP Configuration Options**
   
   **Option A: Use Supabase Built-in Email (Recommended for testing)**
   - Supabase provides built-in email for development
   - Limited to 3 emails per hour for free tier
   - Should work out of the box

   **Option B: Configure Custom SMTP**
   ```
   SMTP Host: your-smtp-host.com
   SMTP Port: 587 (or 465 for SSL)
   SMTP User: your-email@domain.com
   SMTP Pass: your-app-password
   SMTP Sender: your-sender@domain.com
   ```

3. **Email Templates**
   - Go to Authentication → Email Templates
   - Customize "Confirm signup" template if needed
   - Ensure redirect URLs are correct: `{{ .SiteURL }}/verify-email`

### Step 4: Test Authentication Flow

1. **Create Test User**
   ```typescript
   // Test registration with real email
   const testUser = {
     email: 'your-real-email@gmail.com', // Use real email for testing
     password: 'TestPassword123',
     firstName: 'Test',
     lastName: 'User'
   }
   ```

2. **Monitor Logs**
   - Check browser console for errors
   - Check Supabase logs in Dashboard → Logs
   - Look for profile creation success/failure messages

3. **Verify Profile Creation**
   ```sql
   -- Check if profile was created
   SELECT * FROM profiles 
   WHERE email = 'your-test-email@gmail.com';
   ```

### Step 5: Debug Common Issues

#### Issue: "Profile not created after signup"

**Diagnosis:**
```sql
-- Check if trigger is properly installed
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
```

**Solution:**
- Re-run the enhanced SQL setup script
- Check Supabase logs for trigger execution errors
- Verify the function has `SECURITY DEFINER` privilege

#### Issue: "Emails not being sent"

**Diagnosis:**
- Check Authentication → Settings → Email settings
- Verify SMTP configuration or use Supabase built-in email
- Check rate limits (3 emails/hour for free tier)

**Solution:**
1. Use Supabase built-in email for testing
2. Configure custom SMTP for production
3. Check spam folder for verification emails
4. Verify redirect URLs in email templates

#### Issue: "Permission denied on profiles table"

**Diagnosis:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**Solution:**
- Ensure RLS policies allow user operations
- Verify `auth.uid()` function works correctly
- Check service role key if needed for admin operations

## 🧪 Testing Checklist

### Manual Testing Steps

1. **Registration Flow**
   - [ ] Navigate to `/register`
   - [ ] Fill form with real email address
   - [ ] Submit registration
   - [ ] Check browser console for errors
   - [ ] Check email inbox for verification email

2. **Profile Creation**
   - [ ] Check Supabase Dashboard → Authentication → Users
   - [ ] Should see new user in auth.users table
   - [ ] Check Database → profiles table
   - [ ] Should see corresponding profile record

3. **Email Verification**
   - [ ] Click verification link in email
   - [ ] Should redirect to verification page
   - [ ] Enter 6-digit code
   - [ ] Should complete verification successfully

### Diagnostic Tools

1. **Use Auth Debug Page**
   - Navigate to `/auth-debug`
   - Run comprehensive diagnostics
   - Review all test results

2. **Browser Console Monitoring**
   - Open browser developer tools
   - Monitor console during registration
   - Look for error messages and success logs

3. **Supabase Dashboard Monitoring**
   - Monitor Authentication → Users for new registrations
   - Check Database → profiles for profile creation
   - Review Logs for any errors

## 📋 Quick Fix Summary

### For Profile Creation Issues:
1. Run `supabase-setup-enhanced.sql` in Supabase SQL Editor
2. Verify trigger installation with diagnostic queries
3. Test with `/auth-debug` page

### For Email Issues:
1. Check Authentication → Settings → Email in Supabase Dashboard
2. Enable email confirmations
3. Use Supabase built-in email for testing
4. Configure custom SMTP for production

### For Development Testing:
1. Use the enhanced auth provider with debugging logs
2. Monitor browser console during registration
3. Use real email addresses for testing
4. Check both auth.users and profiles tables

## 🔄 Validation Steps

After implementing fixes:

1. **Create new test user with real email**
2. **Verify profile appears in database**
3. **Confirm verification email is received**
4. **Complete email verification flow**
5. **Ensure user can sign in successfully**

## 📞 Additional Support

If issues persist:
1. Check Supabase community forums
2. Review Supabase documentation for latest changes
3. Contact Supabase support with specific error messages
4. Use the diagnostic tools provided in this codebase

---

**Note**: This troubleshooting guide is based on the current codebase analysis and common Supabase authentication issues. Always test changes in a development environment first.