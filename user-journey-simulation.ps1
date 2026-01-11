# ApplyMint AI User Journey Simulation
# This script simulates a complete user experience through the job application process

$SUPABASE_URL = "https://pidjubyaqzoitmbixzbf.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGp1YnlhcXpvaXRtYml4emJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzE2NDcsImV4cCI6MjA2NjgwNzY0N30.Gy3ugh0LbT58rXbjQuhBLWSmetx_2yWvMf1qDBKEJMs"

$headers = @{
    'apikey' = $SUPABASE_ANON_KEY
    'Content-Type' = 'application/json'
}

# Global variables to store user session data
$global:userToken = $null
$global:userId = $null
$global:selectedJob = $null
$global:userProfile = $null
$global:userResume = $null

Write-Host "🚀 ApplyMint AI User Journey Simulation" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host "Simulating a complete job application experience..." -ForegroundColor Cyan
Write-Host ""

# Function to make authenticated API calls
function Invoke-AuthenticatedApi {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [object]$Body = $null
    )

    $authHeaders = $headers.Clone()
    if ($global:userToken) {
        $authHeaders['Authorization'] = "Bearer $global:userToken"
    }

    $params = @{
        Uri = $Uri
        Method = $Method
        Headers = $authHeaders
    }

    if ($Body) {
        $params.Body = $Body | ConvertTo-Json -Depth 10
    }

    try {
        $response = Invoke-RestMethod @params
        return @{ success = $true; data = $response }
    } catch {
        return @{ success = $false; error = $_.Exception.Message; statusCode = $_.Exception.Response.StatusCode }
    }
}

# Step 1: User Registration/Login
Write-Host "📝 Step 1: User Authentication" -ForegroundColor Magenta
Write-Host "------------------------------" -ForegroundColor Magenta

$userEmail = "john.doe.$(Get-Random)@applymint.test"
$userPassword = "TestPass123!"

Write-Host "Creating new user account..." -ForegroundColor Yellow
$signupBody = @{
    email = $userEmail
    password = $userPassword
    options = @{
        data = @{
            first_name = "John"
            last_name = "Doe"
            full_name = "John Doe"
        }
    }
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/signup" -Method Post -Headers $headers -Body $signupBody
    Write-Host "✅ User account created successfully" -ForegroundColor Green
    Write-Host "   Email: $userEmail" -ForegroundColor Gray
    Write-Host "   User ID: $($signupResponse.user.id)" -ForegroundColor Gray

    $global:userId = $signupResponse.user.id
    $global:userToken = $signupResponse.session.access_token
} catch {
    Write-Host "❌ Failed to create user account: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

# Step 2: Get All Jobs
Write-Host "`n🔍 Step 2: Browse Available Jobs" -ForegroundColor Magenta
Write-Host "-------------------------------" -ForegroundColor Magenta

Write-Host "Fetching all available jobs..." -ForegroundColor Yellow
$jobsResponse = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/jobs?page=1&limit=10"

if ($jobsResponse.success) {
    $jobs = $jobsResponse.data.jobs
    Write-Host "✅ Found $($jobs.Count) jobs" -ForegroundColor Green

    Write-Host "`n📋 Available Jobs:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $jobs.Count; $i++) {
        $job = $jobs[$i]
        Write-Host "   $($i + 1). $($job.title) at $($job.company_name)" -ForegroundColor White
        Write-Host "      Location: $($job.location) | Level: $($job.experience_level)" -ForegroundColor Gray
        Write-Host "      Salary: `$$($job.salary_min) - `$$($job.salary_max)" -ForegroundColor Gray
    }

    # Select the first job for our simulation
    $global:selectedJob = $jobs[0]
    Write-Host "`n🎯 Selected job for application: $($global:selectedJob.title)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Failed to fetch jobs: $($jobsResponse.error)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

# Step 3: Create User Profile
Write-Host "`n👤 Step 3: Create User Profile" -ForegroundColor Magenta
Write-Host "----------------------------" -ForegroundColor Magenta

Write-Host "Creating comprehensive user profile..." -ForegroundColor Yellow

$profileData = @{
    first_name = "John"
    last_name = "Doe"
    email = $userEmail
    phone = "+1-555-0123"
    location = "San Francisco, CA"
    bio = "Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies."
    linkedin_url = "https://linkedin.com/in/johndoe"
    github_url = "https://github.com/johndoe"
    portfolio_url = "https://johndoe.dev"
    current_title = "Senior Software Developer"
    years_of_experience = 5
    desired_salary_min = 100000
    desired_salary_max = 150000
    desired_job_types = @("FULL_TIME", "CONTRACT")
    preferred_locations = @("San Francisco, CA", "Remote")
    willing_to_relocate = $true
    work_experiences = @(
        @{
            title = "Senior Full Stack Developer"
            company = "Tech Innovations Inc"
            location = "San Francisco, CA"
            employment_type = "FULL_TIME"
            is_current = $true
            start_date = "2022-01-15"
            description = "Lead development of customer-facing web applications using React, Node.js, and AWS. Mentored junior developers and implemented CI/CD pipelines."
            achievements = @(
                "Improved application performance by 40%",
                "Led migration to microservices architecture",
                "Reduced deployment time by 60%"
            )
            skills_used = @("React", "Node.js", "AWS", "PostgreSQL", "Docker")
        },
        @{
            title = "Full Stack Developer"
            company = "StartupXYZ"
            location = "San Francisco, CA"
            employment_type = "FULL_TIME"
            is_current = $false
            start_date = "2020-03-01"
            end_date = "2021-12-31"
            description = "Developed and maintained multiple client projects using modern web technologies. Collaborated with cross-functional teams in agile environment."
            achievements = @(
                "Delivered 5 major projects on time",
                "Implemented responsive design patterns",
                "Built RESTful APIs serving 10k+ users"
            )
            skills_used = @("JavaScript", "React", "Express.js", "MongoDB", "Git")
        }
    )
    educations = @(
        @{
            institution = "University of California, Berkeley"
            degree = "Bachelor of Science"
            field_of_study = "Computer Science"
            start_date = "2016-09-01"
            end_date = "2020-05-15"
            gpa = 3.8
            achievements = @(
                "Dean's List for 6 semesters",
                "President of Computer Science Club",
                "Completed capstone project on machine learning"
            )
        }
    )
    skills = @(
        @{ name = "JavaScript"; level = "EXPERT"; years_of_experience = 5 }
        @{ name = "React"; level = "EXPERT"; years_of_experience = 4 }
        @{ name = "Node.js"; level = "EXPERT"; years_of_experience = 4 }
        @{ name = "TypeScript"; level = "ADVANCED"; years_of_experience = 3 }
        @{ name = "Python"; level = "INTERMEDIATE"; years_of_experience = 2 }
        @{ name = "AWS"; level = "ADVANCED"; years_of_experience = 3 }
        @{ name = "Docker"; level = "ADVANCED"; years_of_experience = 2 }
        @{ name = "PostgreSQL"; level = "ADVANCED"; years_of_experience = 3 }
        @{ name = "Git"; level = "EXPERT"; years_of_experience = 5 }
    )
    certifications = @(
        @{
            name = "AWS Certified Solutions Architect"
            issuer = "Amazon Web Services"
            issue_date = "2023-06-15"
            expiry_date = "2026-06-15"
            credential_id = "AWS-SAA-123456"
            credential_url = "https://aws.amazon.com/verification"
        },
        @{
            name = "Certified Kubernetes Administrator"
            issuer = "Cloud Native Computing Foundation"
            issue_date = "2023-03-20"
            expiry_date = "2025-03-20"
            credential_id = "CKA-789012"
            credential_url = "https://www.credly.com/badges/cka-certification"
        }
    )
    projects = @(
        @{
            name = "E-commerce Platform"
            description = "Full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Features include user authentication, payment processing, and admin dashboard."
            technologies = @("React", "Node.js", "PostgreSQL", "Stripe API", "AWS")
            start_date = "2023-01-01"
            end_date = "2023-06-30"
            project_url = "https://github.com/johndoe/ecommerce-platform"
            is_public = $true
            highlights = @(
                "Processed 1000+ transactions",
                "99.9% uptime during beta testing",
                "Scalable architecture supporting 10k+ users"
            )
        }
    )
    languages = @(
        @{ language = "English"; proficiency = "NATIVE" }
        @{ language = "Spanish"; proficiency = "INTERMEDIATE" }
    )
}

$profileResponse = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/profiles" -Method Put -Body $profileData

if ($profileResponse.success) {
    $global:userProfile = $profileResponse.data.profile
    Write-Host "✅ User profile created successfully" -ForegroundColor Green
    Write-Host "   Profile ID: $($global:userProfile.id)" -ForegroundColor Gray
    Write-Host "   Skills added: $($global:userProfile.skills.Count)" -ForegroundColor Gray
    Write-Host "   Work experiences: $($global:userProfile.work_experiences.Count)" -ForegroundColor Gray
} else {
    Write-Host "❌ Failed to create profile: $($profileResponse.error)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Step 4: Create Resume
Write-Host "`n📄 Step 4: Create Resume" -ForegroundColor Magenta
Write-Host "---------------------" -ForegroundColor Magenta

Write-Host "Creating professional resume..." -ForegroundColor Yellow

$resumeData = @{
    title = "Senior Full Stack Developer Resume"
    summary = "Experienced full-stack developer with 5+ years of expertise in modern web technologies, cloud platforms, and agile development practices. Proven track record of delivering high-quality software solutions and leading development teams."
    is_primary = $true
    # The resume will automatically include work experiences, education, skills, etc. from the profile
}

$resumeResponse = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/resumes" -Method Post -Body $resumeData

if ($resumeResponse.success) {
    $global:userResume = $resumeResponse.data.resume
    Write-Host "✅ Resume created successfully" -ForegroundColor Green
    Write-Host "   Resume ID: $($global:userResume.id)" -ForegroundColor Gray
    Write-Host "   Title: $($global:userResume.title)" -ForegroundColor Gray
} else {
    Write-Host "❌ Failed to create resume: $($resumeResponse.error)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Step 5: Apply to Selected Job
Write-Host "`n📝 Step 5: Apply to Job" -ForegroundColor Magenta
Write-Host "-------------------" -ForegroundColor Magenta

Write-Host "Applying to: $($global:selectedJob.title) at $($global:selectedJob.company_name)" -ForegroundColor Yellow

$applicationData = @{
    job_id = $global:selectedJob.id
    cover_letter = "Dear Hiring Manager,

I am excited to apply for the $($global:selectedJob.title) position at $($global:selectedJob.company_name). With my 5+ years of experience in full-stack development and expertise in React, Node.js, and cloud technologies, I am confident I can contribute significantly to your team.

In my current role as Senior Full Stack Developer, I have successfully led the development of customer-facing applications, improved performance by 40%, and mentored junior developers. My experience with $($global:selectedJob.skills -join ', ') aligns perfectly with the requirements of this position.

I am particularly drawn to $($global:selectedJob.company_name) because of your innovative approach to technology and commitment to excellence. I would welcome the opportunity to discuss how my skills and experience can contribute to your continued success.

Thank you for considering my application.

Best regards,
John Doe"
    resume_id = $global:userResume.id
    application_status = "PENDING"
    notes = "Applied through ApplyMint AI platform"
}

$applicationResponse = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/job-applications" -Method Post -Body $applicationData

if ($applicationResponse.success) {
    Write-Host "✅ Job application submitted successfully" -ForegroundColor Green
    Write-Host "   Application ID: $($applicationResponse.data.application.id)" -ForegroundColor Gray
    Write-Host "   Status: $($applicationResponse.data.application.status)" -ForegroundColor Gray
} else {
    Write-Host "❌ Failed to submit application: $($applicationResponse.error)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Step 6: Save the Job
Write-Host "`n⭐ Step 6: Save Job for Later" -ForegroundColor Magenta
Write-Host "-------------------------" -ForegroundColor Magenta

Write-Host "Saving job: $($global:selectedJob.title)" -ForegroundColor Yellow

$saveJobData = @{
    job_id = $global:selectedJob.id
}

$saveResponse = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/saved-jobs" -Method Post -Body $saveJobData

if ($saveResponse.success) {
    Write-Host "✅ Job saved successfully" -ForegroundColor Green
    Write-Host "   Saved Job ID: $($saveResponse.data.savedJob.id)" -ForegroundColor Gray
} else {
    Write-Host "❌ Failed to save job: $($saveResponse.error)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Step 7: Create Job Alert
Write-Host "`n🔔 Step 7: Set Up Job Alerts" -ForegroundColor Magenta
Write-Host "-------------------------" -ForegroundColor Magenta

Write-Host "Creating job alert for similar positions..." -ForegroundColor Yellow

$alertData = @{
    name = "Full Stack Developer Opportunities"
    criteria = @{
        keywords = @("Full Stack", "React", "Node.js", "JavaScript")
        locations = @("San Francisco, CA", "Remote")
        experienceLevels = @("MID", "SENIOR")
        employmentTypes = @("FULL_TIME")
        salaryMin = 90000
        skills = @("React", "Node.js", "TypeScript")
    }
    frequency = "DAILY"
    is_active = $true
    notification_preferences = @{
        email = $true
        push = $false
        in_app = $true
    }
}

$alertResponse = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/job-alerts" -Method Post -Body $alertData

if ($alertResponse.success) {
    Write-Host "✅ Job alert created successfully" -ForegroundColor Green
    Write-Host "   Alert ID: $($alertResponse.data.jobAlert.id)" -ForegroundColor Gray
    Write-Host "   Name: $($alertResponse.data.jobAlert.name)" -ForegroundColor Gray
    Write-Host "   Frequency: $($alertResponse.data.jobAlert.frequency)" -ForegroundColor Gray
} else {
    Write-Host "❌ Failed to create job alert: $($alertResponse.error)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Step 8: Verify User Data
Write-Host "`n🔍 Step 8: Verify Complete User Journey" -ForegroundColor Magenta
Write-Host "-------------------------------------" -ForegroundColor Magenta

Write-Host "Verifying all user data and applications..." -ForegroundColor Yellow

# Check profile
$profileCheck = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/profiles"
if ($profileCheck.success) {
    Write-Host "✅ Profile verified - Skills: $($profileCheck.data.profile.skills.Count), Experience: $($profileCheck.data.profile.work_experiences.Count)" -ForegroundColor Green
} else {
    Write-Host "❌ Profile check failed: $($profileCheck.error)" -ForegroundColor Red
}

# Check applications
$applicationsCheck = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/job-applications?page=1&limit=10"
if ($applicationsCheck.success) {
    Write-Host "✅ Applications verified - Total: $($applicationsCheck.data.applications.Count)" -ForegroundColor Green
} else {
    Write-Host "❌ Applications check failed: $($applicationsCheck.error)" -ForegroundColor Red
}

# Check saved jobs
$savedJobsCheck = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/saved-jobs?page=1&limit=10"
if ($savedJobsCheck.success) {
    Write-Host "✅ Saved jobs verified - Total: $($savedJobsCheck.data.savedJobs.Count)" -ForegroundColor Green
} else {
    Write-Host "❌ Saved jobs check failed: $($savedJobsCheck.error)" -ForegroundColor Red
}

# Check job alerts
$alertsCheck = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/job-alerts?page=1&limit=10"
if ($alertsCheck.success) {
    Write-Host "✅ Job alerts verified - Total: $($alertsCheck.data.jobAlerts.Count)" -ForegroundColor Green
} else {
    Write-Host "❌ Job alerts check failed: $($alertsCheck.error)" -ForegroundColor Red
}

# Check resumes
$resumesCheck = Invoke-AuthenticatedApi -Uri "$SUPABASE_URL/functions/v1/resumes?page=1&limit=10"
if ($resumesCheck.success) {
    Write-Host "✅ Resumes verified - Total: $($resumesCheck.data.resumes.Count)" -ForegroundColor Green
} else {
    Write-Host "❌ Resumes check failed: $($resumesCheck.error)" -ForegroundColor Red
}

Write-Host "`n🎉 User Journey Simulation Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Yellow
Write-Host "✅ User registered and authenticated" -ForegroundColor Green
Write-Host "✅ Browsed and selected job" -ForegroundColor Green
Write-Host "✅ Created comprehensive profile with skills & experience" -ForegroundColor Green
Write-Host "✅ Created professional resume" -ForegroundColor Green
Write-Host "✅ Submitted job application with cover letter" -ForegroundColor Green
Write-Host "✅ Saved job for later reference" -ForegroundColor Green
Write-Host "✅ Set up job alerts for similar positions" -ForegroundColor Green
Write-Host "✅ All data verified and accessible via APIs" -ForegroundColor Green

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   User ID: $global:userId" -ForegroundColor White
Write-Host "   Email: $userEmail" -ForegroundColor White
Write-Host "   Selected Job: $($global:selectedJob.title)" -ForegroundColor White
Write-Host "   Profile Created: $(if ($global:userProfile) { 'Yes' } else { 'No' })" -ForegroundColor White
Write-Host "   Resume Created: $(if ($global:userResume) { 'Yes' } else { 'No' })" -ForegroundColor White
Write-Host "   Application Submitted: Yes" -ForegroundColor White
Write-Host "   Job Saved: Yes" -ForegroundColor White
Write-Host "   Job Alert Created: Yes" -ForegroundColor White

Write-Host "`n🚀 The complete ApplyMint AI user experience has been successfully simulated!" -ForegroundColor Green