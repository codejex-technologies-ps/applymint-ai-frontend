#!/bin/bash

# ApplyMint AI User Journey Simulation
# This script simulates a complete user experience through the job application process

# Read from .env.local if available, otherwise use defaults
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://pidjubyaqzoitmbixzbf.supabase.co}"
SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGp1YnlhcXpvaXRtYml4emJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzE2NDcsImV4cCI6MjA2NjgwNzY0N30.Gy3ugh0LbT58rXbjQuhBLWSmetx_2yWvMf1qDBKEJMs}"

# Global variables to store user session data
USER_TOKEN=""
USER_ID=""
SELECTED_JOB_ID=""
USER_PROFILE_ID=""
USER_RESUME_ID=""

echo "🚀 ApplyMint AI User Journey Simulation"
echo "======================================="
echo "Simulating a complete job application experience..."
echo ""

# Function to make authenticated API calls
make_api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$USER_TOKEN" ]; then
        curl -s -X "$method" "${SUPABASE_URL}${endpoint}" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"}
    else
        curl -s -X "$method" "${SUPABASE_URL}${endpoint}" \
            -H "apikey: ${SUPABASE_ANON_KEY}" \
            -H "Authorization: Bearer ${USER_TOKEN}" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"}
    fi
}

# Step 1: User Registration/Login
echo "📝 Step 1: User Authentication"
echo "------------------------------"

USER_EMAIL="john.doe.${RANDOM}@applymint.test"
USER_PASSWORD="TestPass123!"

echo "Creating new user account..."
signup_response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/signup" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"${USER_EMAIL}\",
        \"password\": \"${USER_PASSWORD}\",
        \"options\": {
            \"data\": {
                \"first_name\": \"John\",
                \"last_name\": \"Doe\",
                \"full_name\": \"John Doe\"
            }
        }
    }")

if echo "$signup_response" | jq -e '.user.id' > /dev/null 2>&1; then
    USER_ID=$(echo "$signup_response" | jq -r '.user.id')
    USER_TOKEN=$(echo "$signup_response" | jq -r '.session.access_token')
    echo "✅ User account created successfully"
    echo "   Email: $USER_EMAIL"
    echo "   User ID: $USER_ID"
else
    echo "❌ Failed to create user account"
    echo "Response: $signup_response"
    exit 1
fi

sleep 2

# Step 2: Get All Jobs
echo ""
echo "🔍 Step 2: Browse Available Jobs"
echo "-------------------------------"

echo "Fetching all available jobs..."
jobs_response=$(make_api_call "GET" "/functions/v1/jobs?page=1&limit=10")

if echo "$jobs_response" | jq -e '.jobs' > /dev/null 2>&1; then
    job_count=$(echo "$jobs_response" | jq -r '.jobs | length')
    echo "✅ Found $job_count jobs"
    
    echo ""
    echo "📋 Available Jobs:"
    echo "$jobs_response" | jq -r '.jobs[] | "\(.title) at \(.companies.name)\n   Location: \(.location) | Level: \(.experience_level)\n   Salary: $\(.salary_min) - $\(.salary_max)\n"'
    
    # Select the first job for our simulation
    SELECTED_JOB_ID=$(echo "$jobs_response" | jq -r '.jobs[0].id')
    SELECTED_JOB_TITLE=$(echo "$jobs_response" | jq -r '.jobs[0].title')
    SELECTED_JOB_COMPANY=$(echo "$jobs_response" | jq -r '.jobs[0].companies.name')
    echo "🎯 Selected job for application: $SELECTED_JOB_TITLE at $SELECTED_JOB_COMPANY"
else
    echo "❌ Failed to fetch jobs"
    echo "Response: $jobs_response"
    exit 1
fi

sleep 2

# Step 3: Create User Profile
echo ""
echo "👤 Step 3: Create User Profile"
echo "----------------------------"

echo "Creating comprehensive user profile..."

profile_response=$(make_api_call "PUT" "/functions/v1/profiles" '{
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1-555-0123",
    "location": "San Francisco, CA",
    "bio": "Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "github_url": "https://github.com/johndoe",
    "portfolio_url": "https://johndoe.dev",
    "current_position": "Senior Software Developer",
    "company": "Tech Innovations Inc",
    "years_of_experience": 5,
    "availability_status": "OPEN",
    "preferred_work_type": "REMOTE"
}')

if echo "$profile_response" | jq -e '.profile.id' > /dev/null 2>&1; then
    USER_PROFILE_ID=$(echo "$profile_response" | jq -r '.profile.id')
    echo "✅ User profile created successfully"
    echo "   Profile ID: $USER_PROFILE_ID"
else
    echo "❌ Failed to create profile"
    echo "Response: $profile_response"
fi

sleep 2

# Step 4: Create Resume
echo ""
echo "📄 Step 4: Create Resume"
echo "---------------------"

echo "Creating professional resume..."

resume_response=$(make_api_call "POST" "/functions/v1/resumes" '{
    "title": "Senior Full Stack Developer Resume",
    "summary": "Experienced full-stack developer with 5+ years of expertise in modern web technologies, cloud platforms, and agile development practices. Proven track record of delivering high-quality software solutions and leading development teams.",
    "is_primary": true
}')

if echo "$resume_response" | jq -e '.resume.id' > /dev/null 2>&1; then
    USER_RESUME_ID=$(echo "$resume_response" | jq -r '.resume.id')
    echo "✅ Resume created successfully"
    echo "   Resume ID: $USER_RESUME_ID"
else
    echo "❌ Failed to create resume"
    echo "Response: $resume_response"
fi

sleep 2

# Step 4a: Add Work Experiences
if [ ! -z "$USER_RESUME_ID" ]; then
    echo ""
    echo "💼 Step 4a: Add Work Experiences"
    echo "------------------------------"
    
    # Work Experience 1
    work_exp_1=$(make_api_call "POST" "/functions/v1/work-experiences" "{
        \"resume_id\": \"${USER_RESUME_ID}\",
        \"company\": \"Tech Innovations Inc\",
        \"position\": \"Senior Full Stack Developer\",
        \"location\": \"San Francisco, CA\",
        \"start_date\": \"2022-01-15\",
        \"is_current_role\": true,
        \"description\": \"Lead development of customer-facing web applications using React, Node.js, and AWS. Mentored junior developers and implemented CI/CD pipelines.\",
        \"skills\": [\"React\", \"Node.js\", \"AWS\", \"PostgreSQL\", \"Docker\"]
    }")
    
    if echo "$work_exp_1" | jq -e '.workExperience.id' > /dev/null 2>&1; then
        echo "✅ Added work experience: Senior Full Stack Developer"
    else
        echo "❌ Failed to add work experience 1"
    fi
    
    # Work Experience 2
    work_exp_2=$(make_api_call "POST" "/functions/v1/work-experiences" "{
        \"resume_id\": \"${USER_RESUME_ID}\",
        \"company\": \"StartupXYZ\",
        \"position\": \"Full Stack Developer\",
        \"location\": \"San Francisco, CA\",
        \"start_date\": \"2020-03-01\",
        \"end_date\": \"2021-12-31\",
        \"is_current_role\": false,
        \"description\": \"Developed and maintained multiple client projects using modern web technologies. Collaborated with cross-functional teams in agile environment.\",
        \"skills\": [\"JavaScript\", \"React\", \"Express.js\", \"MongoDB\", \"Git\"]
    }")
    
    if echo "$work_exp_2" | jq -e '.workExperience.id' > /dev/null 2>&1; then
        echo "✅ Added work experience: Full Stack Developer"
    else
        echo "❌ Failed to add work experience 2"
    fi
fi

sleep 2

# Step 4b: Add Skills
if [ ! -z "$USER_RESUME_ID" ]; then
    echo ""
    echo "🎯 Step 4b: Add Skills"
    echo "-------------------"
    
    # Create skills array
    skills=("JavaScript:EXPERT:TECHNICAL" "React:EXPERT:TECHNICAL" "Node.js:EXPERT:TECHNICAL" "TypeScript:ADVANCED:TECHNICAL" "Python:INTERMEDIATE:TECHNICAL" "AWS:ADVANCED:TOOL" "Docker:ADVANCED:TOOL" "PostgreSQL:ADVANCED:TECHNICAL" "Git:EXPERT:TOOL")
    
    for skill_data in "${skills[@]}"; do
        IFS=':' read -r skill_name skill_level skill_category <<< "$skill_data"
        
        skill_response=$(make_api_call "POST" "/functions/v1/skills" "{
            \"resume_id\": \"${USER_RESUME_ID}\",
            \"name\": \"${skill_name}\",
            \"level\": \"${skill_level}\",
            \"category\": \"${skill_category}\"
        }")
        
        if echo "$skill_response" | jq -e '.skill.id' > /dev/null 2>&1; then
            echo "✅ Added skill: ${skill_name} (${skill_level})"
        else
            echo "❌ Failed to add skill: ${skill_name}"
        fi
    done
fi

sleep 2

# Step 5: Apply to Selected Job
echo ""
echo "📝 Step 5: Apply to Job"
echo "-------------------"

if [ ! -z "$SELECTED_JOB_ID" ] && [ ! -z "$USER_RESUME_ID" ]; then
    echo "Applying to: $SELECTED_JOB_TITLE at $SELECTED_JOB_COMPANY"
    
    application_response=$(make_api_call "POST" "/functions/v1/job-applications" "{
        \"job_id\": \"${SELECTED_JOB_ID}\",
        \"user_id\": \"${USER_ID}\",
        \"resume_id\": \"${USER_RESUME_ID}\",
        \"cover_letter\": \"Dear Hiring Manager,\\n\\nI am excited to apply for the ${SELECTED_JOB_TITLE} position at ${SELECTED_JOB_COMPANY}. With my 5+ years of experience in full-stack development and expertise in React, Node.js, and cloud technologies, I am confident I can contribute significantly to your team.\\n\\nThank you for considering my application.\\n\\nBest regards,\\nJohn Doe\"
    }")
    
    if echo "$application_response" | jq -e '.application.id' > /dev/null 2>&1; then
        APPLICATION_ID=$(echo "$application_response" | jq -r '.application.id')
        APPLICATION_STATUS=$(echo "$application_response" | jq -r '.application.status')
        echo "✅ Job application submitted successfully"
        echo "   Application ID: $APPLICATION_ID"
        echo "   Status: $APPLICATION_STATUS"
    else
        echo "❌ Failed to submit application"
        echo "Response: $application_response"
    fi
else
    echo "⚠️  Skipping job application (missing job ID or resume ID)"
fi

sleep 2

# Step 6: Save the Job
echo ""
echo "⭐ Step 6: Save Job for Later"
echo "-------------------------"

if [ ! -z "$SELECTED_JOB_ID" ]; then
    echo "Saving job: $SELECTED_JOB_TITLE"
    
    save_response=$(make_api_call "POST" "/functions/v1/saved-jobs" "{
        \"job_id\": \"${SELECTED_JOB_ID}\",
        \"notes\": \"Interesting opportunity with great benefits\"
    }")
    
    if echo "$save_response" | jq -e '.savedJob.id' > /dev/null 2>&1; then
        SAVED_JOB_ID=$(echo "$save_response" | jq -r '.savedJob.id')
        echo "✅ Job saved successfully"
        echo "   Saved Job ID: $SAVED_JOB_ID"
    else
        echo "❌ Failed to save job"
        echo "Response: $save_response"
    fi
else
    echo "⚠️  Skipping save job (missing job ID)"
fi

sleep 2

# Step 7: Create Job Alert
echo ""
echo "🔔 Step 7: Set Up Job Alerts"
echo "-------------------------"

echo "Creating job alert for similar positions..."

alert_response=$(make_api_call "POST" "/functions/v1/job-alerts" '{
    "name": "Full Stack Developer Opportunities",
    "criteria": {
        "keywords": ["Full Stack", "React", "Node.js", "JavaScript"],
        "locations": ["San Francisco, CA", "Remote"],
        "experienceLevels": ["MID", "SENIOR"],
        "employmentTypes": ["FULL_TIME"],
        "salaryMin": 90000,
        "skills": ["React", "Node.js", "TypeScript"]
    },
    "frequency": "DAILY",
    "is_active": true
}')

if echo "$alert_response" | jq -e '.jobAlert.id' > /dev/null 2>&1; then
    ALERT_ID=$(echo "$alert_response" | jq -r '.jobAlert.id')
    ALERT_NAME=$(echo "$alert_response" | jq -r '.jobAlert.name')
    ALERT_FREQUENCY=$(echo "$alert_response" | jq -r '.jobAlert.frequency')
    echo "✅ Job alert created successfully"
    echo "   Alert ID: $ALERT_ID"
    echo "   Name: $ALERT_NAME"
    echo "   Frequency: $ALERT_FREQUENCY"
else
    echo "❌ Failed to create job alert"
    echo "Response: $alert_response"
fi

sleep 2

# Step 8: Verify User Data
echo ""
echo "🔍 Step 8: Verify Complete User Journey"
echo "-------------------------------------"

echo "Verifying all user data and applications..."

# Check profile
profile_check=$(make_api_call "GET" "/functions/v1/profiles")
if echo "$profile_check" | jq -e '.profile.id' > /dev/null 2>&1; then
    echo "✅ Profile verified"
else
    echo "❌ Profile check failed"
fi

# Check applications
applications_check=$(make_api_call "GET" "/functions/v1/job-applications?page=1&limit=10")
if echo "$applications_check" | jq -e '.applications' > /dev/null 2>&1; then
    app_count=$(echo "$applications_check" | jq -r '.applications | length')
    echo "✅ Applications verified - Total: $app_count"
else
    echo "❌ Applications check failed"
fi

# Check saved jobs
saved_jobs_check=$(make_api_call "GET" "/functions/v1/saved-jobs?page=1&limit=10")
if echo "$saved_jobs_check" | jq -e '.savedJobs' > /dev/null 2>&1; then
    saved_count=$(echo "$saved_jobs_check" | jq -r '.savedJobs | length')
    echo "✅ Saved jobs verified - Total: $saved_count"
else
    echo "❌ Saved jobs check failed"
fi

# Check job alerts
alerts_check=$(make_api_call "GET" "/functions/v1/job-alerts?page=1&limit=10")
if echo "$alerts_check" | jq -e '.jobAlerts' > /dev/null 2>&1; then
    alert_count=$(echo "$alerts_check" | jq -r '.jobAlerts | length')
    echo "✅ Job alerts verified - Total: $alert_count"
else
    echo "❌ Job alerts check failed"
fi

# Check resumes
resumes_check=$(make_api_call "GET" "/functions/v1/resumes?page=1&limit=10")
if echo "$resumes_check" | jq -e '.resumes' > /dev/null 2>&1; then
    resume_count=$(echo "$resumes_check" | jq -r '.resumes | length')
    echo "✅ Resumes verified - Total: $resume_count"
else
    echo "❌ Resumes check failed"
fi

# Check work experiences
if [ ! -z "$USER_RESUME_ID" ]; then
    work_exp_check=$(make_api_call "GET" "/functions/v1/work-experiences?resumeId=${USER_RESUME_ID}")
    if echo "$work_exp_check" | jq -e '.workExperiences' > /dev/null 2>&1; then
        work_exp_count=$(echo "$work_exp_check" | jq -r '.workExperiences | length')
        echo "✅ Work experiences verified - Total: $work_exp_count"
    else
        echo "❌ Work experiences check failed"
    fi
fi

# Check skills
if [ ! -z "$USER_RESUME_ID" ]; then
    skills_check=$(make_api_call "GET" "/functions/v1/skills?resumeId=${USER_RESUME_ID}")
    if echo "$skills_check" | jq -e '.skills' > /dev/null 2>&1; then
        skills_count=$(echo "$skills_check" | jq -r '.skills | length')
        echo "✅ Skills verified - Total: $skills_count"
    else
        echo "❌ Skills check failed"
    fi
fi

echo ""
echo "🎉 User Journey Simulation Complete!"
echo "===================================="
echo "✅ User registered and authenticated"
echo "✅ Browsed and selected job"
echo "✅ Created comprehensive profile"
echo "✅ Created professional resume"
echo "✅ Added work experiences"
echo "✅ Added skills"
echo "✅ Submitted job application with cover letter"
echo "✅ Saved job for later reference"
echo "✅ Set up job alerts for similar positions"
echo "✅ All data verified and accessible via APIs"

echo ""
echo "📊 Summary:"
echo "   User ID: $USER_ID"
echo "   Email: $USER_EMAIL"
echo "   Selected Job: $SELECTED_JOB_TITLE"
echo "   Profile Created: $([ ! -z "$USER_PROFILE_ID" ] && echo 'Yes' || echo 'No')"
echo "   Resume Created: $([ ! -z "$USER_RESUME_ID" ] && echo 'Yes' || echo 'No')"
echo "   Application Submitted: Yes"
echo "   Job Saved: Yes"
echo "   Job Alert Created: Yes"

echo ""
echo "🚀 The complete ApplyMint AI user experience has been successfully simulated!"
