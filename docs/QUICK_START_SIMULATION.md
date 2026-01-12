# Quick Start Guide - API Simulation

## 🚀 Ready to Run in 3 Steps

### Step 1: Deploy Supabase Functions (One-Time Setup)

```bash
# Deploy all Supabase functions
npx supabase functions deploy

# Or deploy only the new functions
npx supabase functions deploy skills
npx supabase functions deploy work-experiences
```

### Step 2: Test API Connectivity

```bash
cd scripts
./test-api-connectivity.sh
```

You should see:
```
✅ Jobs endpoint is accessible
✅ Companies endpoint is accessible
✅ Auth endpoint is healthy
```

### Step 3: Run Complete Simulation

```bash
./run-complete-simulation.sh
```

## 📋 What Happens During Simulation

### Phase 1: Dummy Data Creation
- Creates 4 companies (TechCorp, DataFlow, InnovateLabs, CloudSync)
- Creates 5 job postings (various roles and levels)
- Takes ~30 seconds

### Phase 2: User Journey
- Registers new user account
- Browses and selects a job
- Creates user profile
- Creates resume
- Adds 2 work experiences
- Adds 9 skills
- Submits job application
- Saves job for later
- Creates job alert
- Verifies all data
- Takes ~45 seconds

### Total Time: ~1.5 minutes

## ✅ Expected Output

```
╔════════════════════════════════════════════════════════════╗
║     ApplyMint AI - Complete API Simulation Suite          ║
╚════════════════════════════════════════════════════════════╝

Phase 1: Creating Dummy Data
═══════════════════════════════════════════════════════════
✅ Created company: TechCorp Solutions
✅ Created company: DataFlow Systems
✅ Created job: Senior Full Stack Developer at TechCorp Solutions
...

Phase 2: User Journey Simulation
═══════════════════════════════════════════════════════════
✅ User account created successfully
✅ Found 5 jobs
✅ User profile created successfully
✅ Resume created successfully
✅ Added work experience: Senior Full Stack Developer
✅ Added skill: JavaScript (EXPERT)
✅ Job application submitted successfully
✅ Job saved successfully
✅ Job alert created successfully
✅ All data verified

🎉 API SIMULATION COMPLETED SUCCESSFULLY 🎉
```

## 🔍 Verify Results

### Option 1: Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to Table Editor
4. Check tables: companies, jobs, profiles, resumes, work_experiences, skills, job_applications, saved_jobs, job_alerts

### Option 2: API Calls
```bash
# Check created companies
curl -X GET "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/companies?page=1&limit=10" \
  -H "apikey: YOUR_ANON_KEY"

# Check created jobs
curl -X GET "https://pidjubyaqzoitmbixzbf.supabase.co/functions/v1/jobs?page=1&limit=10" \
  -H "apikey: YOUR_ANON_KEY"
```

## 🐛 Troubleshooting

### Issue: "Command not found: jq"
```bash
sudo apt-get install jq
```

### Issue: "Permission denied"
```bash
chmod +x scripts/*.sh
```

### Issue: "API endpoint failed"
Make sure Supabase functions are deployed:
```bash
npx supabase functions list
```

### Issue: Functions not deploying
Check if Docker is running or use:
```bash
npx supabase functions deploy --no-verify-jwt
```

## 📚 Additional Resources

- **Detailed Usage**: See `scripts/README.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Implementation Details**: See `API_SIMULATION_SUMMARY.md`

## 💡 Pro Tips

1. **Run multiple times**: Each simulation creates a new user with random email
2. **Check logs**: Use `npx supabase functions logs` to debug issues
3. **Clean up**: Delete test data from Supabase Dashboard between runs
4. **Customize**: Edit scripts to test different scenarios

## 🎯 Next Steps

After successful simulation:

1. **Review created data** in Supabase Dashboard
2. **Test frontend integration** with the API endpoints
3. **Implement additional features** based on the user journey
4. **Add more test scenarios** for edge cases

---

**Need help?** Check the troubleshooting sections in the detailed documentation files.
