# Deploying Supabase Functions

This guide explains how to deploy the Supabase Edge Functions required for the API simulation scripts.

## Prerequisites

1. **Supabase CLI** installed:
   ```bash
   npm install -g supabase
   # or
   pnpm add -g supabase
   ```

2. **Supabase Project** initialized and linked:
   ```bash
   npx supabase login
   npx supabase link --project-ref pidjubyaqzoitmbixzbf
   ```

## Functions to Deploy

The following Supabase Edge Functions need to be deployed:

### Core Functions (Existing)
- `jobs` - Job listings and management
- `companies` - Company information
- `profiles` - User profiles
- `resumes` - Resume management
- `job-applications` - Job application submissions
- `saved-jobs` - Bookmarked jobs
- `job-alerts` - Job alert configuration

### New Functions (Added in this PR)
- `skills` - User skills management
- `work-experiences` - Work experience tracking

## Deployment Commands

### Deploy All Functions

```bash
# Deploy all functions at once
npx supabase functions deploy

# Or deploy with Docker (if Docker is running)
npx supabase functions deploy --no-verify-jwt
```

### Deploy Individual Functions

```bash
# Deploy new functions
npx supabase functions deploy skills
npx supabase functions deploy work-experiences

# Re-deploy existing functions if needed
npx supabase functions deploy jobs
npx supabase functions deploy companies
npx supabase functions deploy profiles
npx supabase functions deploy resumes
npx supabase functions deploy job-applications
npx supabase functions deploy saved-jobs
npx supabase functions deploy job-alerts
```

## Verify Deployment

After deployment, verify functions are working:

```bash
# List all deployed functions
npx supabase functions list

# Check function logs
npx supabase functions logs

# Test a specific function
npx supabase functions logs skills
```

## Test Deployed Functions

Once deployed, test with the connectivity script:

```bash
cd scripts
./test-api-connectivity.sh
```

Expected output:
```
✅ Jobs endpoint is accessible
   Found X existing jobs
✅ Companies endpoint is accessible
   Found X existing companies
✅ Auth endpoint is healthy
```

## Common Deployment Issues

### Issue: Docker not running

**Error**: `Cannot connect to Docker daemon`

**Solution**: 
```bash
# On Linux/Ubuntu
sudo systemctl start docker

# Or skip Docker verification
npx supabase functions deploy --no-verify-jwt
```

### Issue: Module not found errors

**Error**: `Module not found: ...`

**Solution**: Check import paths in function files. All imports should use:
- `jsr:@supabase/functions-js/edge-runtime.d.ts` for types
- `https://esm.sh/@supabase/supabase-js@2.39.3` for Supabase client
- `../_shared/cors.ts` for CORS headers

### Issue: Authentication errors

**Error**: `Unauthorized` or `Invalid API key`

**Solution**: 
1. Verify your Supabase project is linked:
   ```bash
   npx supabase projects list
   ```
2. Re-link if necessary:
   ```bash
   npx supabase link --project-ref pidjubyaqzoitmbixzbf
   ```

### Issue: Function timeout

**Error**: `Function timed out`

**Solution**: Functions have a 60-second timeout by default. For long-running operations, consider:
- Breaking into smaller chunks
- Using async patterns
- Optimizing database queries

## Database Setup

Before running simulations, ensure database tables exist:

```bash
# Run database migrations
npx supabase db push

# Or execute the complete schema
npx supabase db reset
```

The complete schema is in: `complete-database-schema.sql`

## Environment Variables

Functions use these environment variables (automatically available):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous/public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin access)

These are set automatically by Supabase when functions are deployed.

## Next Steps

After successful deployment:

1. **Run API Tests**:
   ```bash
   cd scripts
   ./test-api-connectivity.sh
   ```

2. **Create Dummy Data**:
   ```bash
   ./create-dummy-data.sh
   ```

3. **Run User Journey Simulation**:
   ```bash
   ./user-journey-simulation.sh
   ```

4. **Or Run Complete Simulation**:
   ```bash
   ./run-complete-simulation.sh
   ```

## Monitoring

Monitor function execution:

```bash
# Real-time logs
npx supabase functions logs --follow

# Specific function logs
npx supabase functions logs skills --follow

# Check function analytics in Supabase Dashboard
# https://app.supabase.com/project/pidjubyaqzoitmbixzbf/functions
```

## Troubleshooting

If simulations fail after deployment:

1. Check function logs:
   ```bash
   npx supabase functions logs
   ```

2. Verify database tables exist:
   ```bash
   npx supabase db diff
   ```

3. Test individual endpoints with curl:
   ```bash
   curl -X GET "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/jobs?page=1&limit=5" \
     -H "apikey: YOUR_ANON_KEY"
   ```

4. Check Row Level Security (RLS) policies:
   - Ensure policies allow the operations
   - Check in Supabase Dashboard → Authentication → Policies

## Resources

- [Supabase Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [Edge Functions Best Practices](https://supabase.com/docs/guides/functions/best-practices)
