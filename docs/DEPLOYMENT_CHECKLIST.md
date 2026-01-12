# 🎯 DEPLOYMENT & EXECUTION CHECKLIST

## Prerequisites ✅

Before proceeding, ensure you have:

- [ ] Node.js and npm/pnpm installed
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Supabase project linked (`npx supabase link`)
- [ ] curl and jq installed (for scripts)
- [ ] Database schema deployed

## Step-by-Step Deployment

### 1️⃣ Deploy Supabase Functions

```bash
# Make sure you're in the project root
cd /path/to/applymint-ai-frontend

# Deploy all functions (recommended)
npx supabase functions deploy

# Or deploy only new functions
npx supabase functions deploy skills
npx supabase functions deploy work-experiences
```

**Expected output:**
```
Deploying function skills...
Deploying function work-experiences...
✓ Deployed function skills successfully
✓ Deployed function work-experiences successfully
```

**Verify deployment:**
```bash
npx supabase functions list
```

You should see:
- ✅ companies
- ✅ jobs
- ✅ profiles
- ✅ resumes
- ✅ work-experiences (NEW)
- ✅ skills (NEW)
- ✅ job-applications
- ✅ saved-jobs
- ✅ job-alerts

### 2️⃣ Test API Connectivity

```bash
cd scripts
chmod +x *.sh  # Make all scripts executable
./test-api-connectivity.sh
```

**Expected output:**
```
🧪 Testing ApplyMint AI API Connectivity
=========================================

Test 1: Checking /functions/v1/jobs endpoint...
✅ Jobs endpoint is accessible
   Found X existing jobs

Test 2: Checking /functions/v1/companies endpoint...
✅ Companies endpoint is accessible
   Found X existing companies

Test 3: Checking Supabase Auth availability...
✅ Auth endpoint is healthy
```

**❌ If you see errors:**
- Check Supabase URL and API key in scripts
- Verify functions are deployed: `npx supabase functions list`
- Check function logs: `npx supabase functions logs`

### 3️⃣ Run API Simulation

#### Option A: Complete Simulation (Recommended)

```bash
./run-complete-simulation.sh
```

This runs:
1. Dummy data creation (companies + jobs)
2. Complete user journey simulation
3. Data verification

**Duration:** ~1.5 minutes

#### Option B: Step by Step

```bash
# Create dummy data only
./create-dummy-data.sh

# Run user journey only
./user-journey-simulation.sh
```

### 4️⃣ Verify Results

#### In Supabase Dashboard:

1. Go to: https://app.supabase.com/project/pidjubyaqzoitmbixzbf
2. Click **Table Editor**
3. Check these tables have new data:
   - companies (should have 4 new entries)
   - jobs (should have 5 new entries)
   - profiles (should have 1 new entry)
   - resumes (should have 1 new entry)
   - work_experiences (should have 2 new entries)
   - skills (should have 9 new entries)
   - job_applications (should have 1 new entry)
   - saved_jobs (should have 1 new entry)
   - job_alerts (should have 1 new entry)

#### Via API:

```bash
# Get companies (should see 4 created)
curl -X GET "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/companies?page=1&limit=10" \
  -H "apikey: YOUR_ANON_KEY" | jq '.'

# Get jobs (should see 5 created)
curl -X GET "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/jobs?page=1&limit=10" \
  -H "apikey: YOUR_ANON_KEY" | jq '.'
```

## Troubleshooting Common Issues

### Issue: Functions not deploying

**Error:** `Error deploying function`

**Solution:**
```bash
# Check Docker is running
docker ps

# Or deploy without Docker
npx supabase functions deploy --no-verify-jwt
```

### Issue: Database tables don't exist

**Error:** `relation "work_experiences" does not exist`

**Solution:**
```bash
# Run database migrations
npx supabase db push

# Or reset database (WARNING: deletes all data)
npx supabase db reset
```

### Issue: Authentication errors

**Error:** `Unauthorized` or `Invalid API key`

**Solution:**
```bash
# Check you're linked to correct project
npx supabase projects list

# Re-link if needed
npx supabase link --project-ref pidjubyaqzoitmbixzbf
```

### Issue: Scripts won't execute

**Error:** `Permission denied`

**Solution:**
```bash
cd scripts
chmod +x *.sh
```

### Issue: curl or jq not found

**Error:** `command not found: jq`

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install curl jq

# macOS
brew install curl jq

# Fedora/RHEL
sudo dnf install curl jq
```

## Success Criteria

✅ All function deployments succeeded  
✅ API connectivity test passed  
✅ Dummy data creation completed  
✅ User journey simulation completed  
✅ All data visible in Supabase Dashboard  
✅ No errors in function logs  

## Next Steps After Successful Deployment

1. **Review the data**: Check Supabase Dashboard to see created records
2. **Test frontend integration**: Update frontend to use new endpoints
3. **Monitor logs**: Use `npx supabase functions logs` to watch activity
4. **Customize scripts**: Modify scripts for your specific testing needs
5. **Add more test cases**: Extend simulations with edge cases

## Support & Documentation

📖 **Documentation Files:**
- `QUICK_START_SIMULATION.md` - 3-step quick start
- `API_SIMULATION_SUMMARY.md` - Complete implementation details
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `scripts/README.md` - Script usage and examples

🔍 **Debugging:**
```bash
# Watch function logs in real-time
npx supabase functions logs --follow

# Check specific function logs
npx supabase functions logs skills
npx supabase functions logs work-experiences

# View database schema
npx supabase db diff
```

## Quick Reference Commands

```bash
# Deploy functions
npx supabase functions deploy

# Test connectivity
cd scripts && ./test-api-connectivity.sh

# Run simulation
./run-complete-simulation.sh

# View logs
npx supabase functions logs

# List functions
npx supabase functions list

# Database operations
npx supabase db push     # Apply migrations
npx supabase db reset    # Reset database
npx supabase db diff     # Show schema changes
```

## Environment Variables (Optional)

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://pidjubyaqzoitmbixzbf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Scripts will automatically use these values if present.

---

**✅ Ready to proceed? Follow the steps above in order!**

If you encounter any issues not covered here, check the detailed documentation files or Supabase function logs for more information.
