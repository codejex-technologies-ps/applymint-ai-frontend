## 🧪 API Simulation & Testing

This project includes comprehensive API simulation scripts that demonstrate the complete user journey through the job application process.

### Quick Start

```bash
# 1. Deploy Supabase functions
npx supabase functions deploy skills
npx supabase functions deploy work-experiences

# 2. Run simulation
cd scripts
./run-complete-simulation.sh
```

### What Gets Simulated

The simulation creates a realistic user journey:

1. ✅ **User Registration** - Creates new account with Supabase Auth
2. ✅ **Job Browsing** - Fetches and displays available positions
3. ✅ **Profile Creation** - Builds comprehensive user profile
4. ✅ **Resume Building** - Creates professional resume
5. ✅ **Work Experience** - Adds employment history (2 entries)
6. ✅ **Skills Management** - Adds technical skills (9 entries)
7. ✅ **Job Application** - Submits application with cover letter
8. ✅ **Save Job** - Bookmarks job for later reference
9. ✅ **Job Alerts** - Sets up automated job notifications
10. ✅ **Data Verification** - Confirms all data via API calls

### New API Endpoints

#### Skills Management `/functions/v1/skills`
```bash
GET    /skills              # List user's skills
GET    /skills/:id          # Get specific skill
POST   /skills              # Add new skill
PUT    /skills/:id          # Update skill
DELETE /skills/:id          # Remove skill
```

#### Work Experience `/functions/v1/work-experiences`
```bash
GET    /work-experiences     # List work history
GET    /work-experiences/:id # Get specific entry
POST   /work-experiences     # Add experience
PUT    /work-experiences/:id # Update experience
DELETE /work-experiences/:id # Remove experience
```

### Scripts Available

| Script | Purpose | Duration |
|--------|---------|----------|
| `create-dummy-data.sh` | Creates 4 companies + 5 jobs | ~30s |
| `user-journey-simulation.sh` | Complete user flow | ~45s |
| `run-complete-simulation.sh` | Orchestrates everything | ~1.5min |
| `test-api-connectivity.sh` | API health check | ~5s |

### Documentation

📖 **Detailed Guides:**
- [Quick Start](./QUICK_START_SIMULATION.md) - Get started in 3 steps
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deploy Supabase functions
- [Implementation Summary](./API_SIMULATION_SUMMARY.md) - Complete technical overview
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment
- [Scripts README](./scripts/README.md) - Script usage and examples

### Requirements

- **Bash** - Shell environment (Linux/macOS/WSL)
- **curl** - HTTP client
- **jq** - JSON processor
- **Supabase CLI** - Function deployment

Install on Ubuntu/Debian:
```bash
sudo apt-get install curl jq
npm install -g supabase
```

### Example Output

```
🚀 ApplyMint AI User Journey Simulation
=======================================

✅ User account created successfully
   Email: john.doe.12345@applymint.test
   User ID: 550e8400-e29b-41d4-a716-446655440000

✅ Found 5 jobs
✅ User profile created successfully
✅ Resume created successfully
✅ Added work experience: Senior Full Stack Developer
✅ Added skill: JavaScript (EXPERT)
✅ Job application submitted successfully
✅ Job saved successfully
✅ Job alert created successfully

🎉 User Journey Simulation Complete!
```

### Verify Results

Check Supabase Dashboard:
- **Companies**: 4 sample companies created
- **Jobs**: 5 job postings created
- **Profiles**: Complete user profile
- **Resumes**: Professional resume
- **Work Experiences**: 2 employment entries
- **Skills**: 9 technical skills
- **Job Applications**: 1 application submitted
- **Saved Jobs**: 1 bookmarked job
- **Job Alerts**: 1 alert configured

---

**For detailed documentation, see the simulation guides linked above.**
