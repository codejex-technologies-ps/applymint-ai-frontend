# ApplyMint AI - API Simulation Scripts

This directory contains scripts to simulate a complete user journey through the ApplyMint AI platform using API calls.

## 🎯 Purpose

These scripts demonstrate the entire job application workflow by making real API calls to Supabase functions:
- Creating companies and jobs
- User registration and authentication
- Profile creation with skills and work experience
- Resume management
- Job applications
- Saved jobs
- Job alerts

## 📋 Prerequisites

- **Bash**: Linux/Unix shell (default in most Linux distributions and macOS)
- **curl**: For making HTTP requests
- **jq**: For parsing JSON responses

### Installing Prerequisites

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install curl jq

# macOS (using Homebrew)
brew install curl jq

# Fedora/RHEL
sudo dnf install curl jq
```

## 🚀 Quick Start

### Run Complete Simulation

Execute all steps in sequence:

```bash
cd scripts
./run-complete-simulation.sh
```

This will:
1. Create dummy companies and jobs
2. Simulate a complete user journey (registration → profile → resume → job application → alerts)

### Run Individual Scripts

#### 1. Create Dummy Data

Populates the database with sample companies and jobs:

```bash
./create-dummy-data.sh
```

Creates:
- 4 sample companies (TechCorp Solutions, DataFlow Systems, InnovateLabs, CloudSync Inc)
- 5 job postings across different roles and experience levels

#### 2. User Journey Simulation

Simulates a complete user experience:

```bash
./user-journey-simulation.sh
```

Performs:
- User registration with email/password
- Authentication and token management
- Browsing available jobs
- Creating a user profile
- Creating a resume
- Adding work experiences
- Adding skills (JavaScript, React, Node.js, etc.)
- Submitting a job application
- Saving a job for later
- Setting up job alerts
- Verifying all created data

## 📁 Script Details

### `create-dummy-data.sh`

**Purpose**: Creates realistic test data for companies and jobs

**Companies Created**:
- TechCorp Solutions (Technology, Medium, San Francisco)
- DataFlow Systems (Technology, Large, New York)
- InnovateLabs (Healthcare, Small, Austin)
- CloudSync Inc (Technology, Medium, Seattle)

**Jobs Created**:
- Senior Full Stack Developer (TechCorp Solutions)
- Data Scientist (DataFlow Systems)
- DevOps Engineer (CloudSync Inc)
- Frontend Developer (TechCorp Solutions)
- Healthcare Data Analyst (InnovateLabs)

### `user-journey-simulation.sh`

**Purpose**: Simulates a realistic user completing the job application process

**Steps Performed**:
1. **User Registration**: Creates a new user account with random email
2. **Authentication**: Obtains and uses auth token for subsequent requests
3. **Browse Jobs**: Fetches available jobs and selects one
4. **Create Profile**: Builds comprehensive user profile with contact info and preferences
5. **Create Resume**: Creates a professional resume
6. **Add Work Experience**: Adds 2 work experiences with skills and descriptions
7. **Add Skills**: Adds 9 technical skills with proficiency levels
8. **Submit Application**: Applies to selected job with cover letter
9. **Save Job**: Bookmarks job for later reference
10. **Create Alert**: Sets up job alert for similar positions
11. **Verification**: Validates all created data through API calls

### `run-complete-simulation.sh`

**Purpose**: Master script that orchestrates the entire simulation

**Features**:
- Checks for required dependencies
- Runs scripts in correct sequence
- Provides progress feedback
- Displays comprehensive summary

## 🔧 Configuration

The scripts use environment variables for Supabase configuration. They will:
1. Try to read from `.env.local` in the project root
2. Fall back to default values if not found

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📊 API Endpoints Tested

All scripts interact with the following Supabase Edge Functions:

- `/functions/v1/companies` - Company management
- `/functions/v1/jobs` - Job listings
- `/functions/v1/profiles` - User profiles
- `/functions/v1/resumes` - Resume management
- `/functions/v1/work-experiences` - Work experience tracking
- `/functions/v1/skills` - Skill management
- `/functions/v1/job-applications` - Job applications
- `/functions/v1/saved-jobs` - Saved jobs
- `/functions/v1/job-alerts` - Job alert configuration
- `/auth/v1/signup` - User registration

## ✅ Success Indicators

When scripts run successfully, you'll see:

```
✅ User account created successfully
✅ Found 5 jobs
✅ User profile created successfully
✅ Resume created successfully
✅ Added work experience: Senior Full Stack Developer
✅ Added skill: JavaScript (EXPERT)
✅ Job application submitted successfully
✅ Job saved successfully
✅ Job alert created successfully
✅ All data verified and accessible via APIs
```

## 🐛 Troubleshooting

### "command not found: curl" or "command not found: jq"

Install missing dependencies:
```bash
sudo apt-get install curl jq
```

### "Failed to create company" or API errors

1. Check Supabase configuration in `.env.local`
2. Verify Supabase functions are deployed:
   ```bash
   npx supabase functions list
   ```
3. Check Supabase function logs:
   ```bash
   npx supabase functions logs
   ```

### Authentication errors

- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correctly set
- Verify Row Level Security (RLS) policies allow the operations
- Check that Supabase Auth is properly configured

### "Permission denied" errors

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

## 🔍 Verification

After running the simulation, you can verify the data in:

1. **Supabase Dashboard**:
   - Table Editor → companies, jobs, profiles, resumes, etc.

2. **API Responses**:
   - Scripts display API responses and IDs for created records

3. **Function Logs**:
   ```bash
   npx supabase functions logs
   ```

## 📝 Example Output

```
🚀 ApplyMint AI User Journey Simulation
=======================================
📝 Step 1: User Authentication
------------------------------
✅ User account created successfully
   Email: john.doe.12345@applymint.test
   User ID: 550e8400-e29b-41d4-a716-446655440000

🔍 Step 2: Browse Available Jobs
-------------------------------
✅ Found 5 jobs
📋 Available Jobs:
Senior Full Stack Developer at TechCorp Solutions
   Location: San Francisco, CA | Level: SENIOR
   Salary: $120000 - $180000

...

🎉 User Journey Simulation Complete!
====================================
✅ All data verified and accessible via APIs
```

## 🎓 Learning Resources

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [REST API Best Practices](https://restfulapi.net/)

## 🤝 Contributing

When adding new simulation features:

1. Create a new script in `/scripts/`
2. Make it executable: `chmod +x your-script.sh`
3. Update this README
4. Test with real Supabase instance
5. Add error handling and validation

## 📄 License

Part of the ApplyMint AI project - see main LICENSE file.
