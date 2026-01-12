# Create Dummy Data for ApplyMint AI Simulation
# This script creates sample companies and jobs for testing

$SUPABASE_URL = "https://pidjubyaqzoitmbixzbf.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGp1YnlhcXpvaXRtYml4emJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzE2NDcsImV4cCI6MjA2NjgwNzY0N30.Gy3ugh0LbT58rXbjQuhBLWSmetx_2yWvMf1qDBKEJMs"

$headers = @{
    'apikey' = $SUPABASE_ANON_KEY
    'Content-Type' = 'application/json'
}

Write-Host "📊 Creating Dummy Data for ApplyMint AI" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Yellow

# Create Companies
Write-Host "`n🏢 Creating Companies..." -ForegroundColor Cyan

$companies = @(
    @{
        name = "TechCorp Solutions"
        industry = "Technology"
        size = "MEDIUM"
        location = "San Francisco, CA"
        description = "Leading technology solutions provider specializing in AI and machine learning."
        website = "https://techcorp.com"
        logo_url = "https://example.com/logos/techcorp.png"
    },
    @{
        name = "DataFlow Systems"
        industry = "Technology"
        size = "LARGE"
        location = "New York, NY"
        description = "Enterprise data management and analytics platform."
        website = "https://dataflow.com"
        logo_url = "https://example.com/logos/dataflow.png"
    },
    @{
        name = "InnovateLabs"
        industry = "Healthcare"
        size = "SMALL"
        location = "Austin, TX"
        description = "Healthcare technology startup focused on patient data analytics."
        website = "https://innovatelabs.com"
        logo_url = "https://example.com/logos/innovatelabs.png"
    },
    @{
        name = "CloudSync Inc"
        industry = "Technology"
        size = "MEDIUM"
        location = "Seattle, WA"
        description = "Cloud infrastructure and DevOps solutions provider."
        website = "https://cloudsync.com"
        logo_url = "https://example.com/logos/cloudsync.png"
    }
)

$createdCompanies = @()

foreach ($company in $companies) {
    try {
        $body = $company | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/companies" -Method Post -Headers $headers -Body $body
        Write-Host "✅ Created company: $($company.name)" -ForegroundColor Green
        $createdCompanies += $response.company
    } catch {
        Write-Host "❌ Failed to create company: $($company.name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create Jobs
Write-Host "`n💼 Creating Jobs..." -ForegroundColor Cyan

$jobs = @(
    @{
        title = "Senior Full Stack Developer"
        company_id = $createdCompanies[0].id
        location = "San Francisco, CA"
        employment_type = "FULL_TIME"
        experience_level = "SENIOR"
        is_remote = $true
        salary_min = 120000
        salary_max = 180000
        salary_currency = "USD"
        description = "We are looking for a Senior Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies including React, Node.js, and cloud services."
        requirements = @(
            "5+ years of experience in full stack development",
            "Strong proficiency in React, Node.js, and TypeScript",
            "Experience with cloud platforms (AWS/Azure/GCP)",
            "Knowledge of database design and SQL",
            "Experience with RESTful APIs and GraphQL"
        )
        benefits = @(
            "Competitive salary and equity package",
            "Health, dental, and vision insurance",
            "Flexible work hours and remote work options",
            "Professional development budget",
            "Modern equipment and tools"
        )
        skills = @("React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "GraphQL", "Docker")
        application_deadline = "2025-12-31T23:59:59Z"
    },
    @{
        title = "Data Scientist"
        company_id = $createdCompanies[1].id
        location = "New York, NY"
        employment_type = "FULL_TIME"
        experience_level = "MID"
        is_remote = $false
        salary_min = 90000
        salary_max = 130000
        salary_currency = "USD"
        description = "Join our data science team to work on cutting-edge machine learning projects. You'll analyze large datasets, build predictive models, and help drive data-driven decision making across the organization."
        requirements = @(
            "3+ years of experience in data science or machine learning",
            "Strong programming skills in Python and R",
            "Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)",
            "Proficiency in SQL and data visualization tools",
            "Statistical analysis and hypothesis testing knowledge"
        )
        benefits = @(
            "Competitive salary with performance bonuses",
            "Comprehensive health benefits",
            "Learning and development opportunities",
            "Flexible PTO policy",
            "Collaborative work environment"
        )
        skills = @("Python", "R", "SQL", "TensorFlow", "scikit-learn", "Tableau", "Statistics")
        application_deadline = "2025-11-30T23:59:59Z"
    },
    @{
        title = "DevOps Engineer"
        company_id = $createdCompanies[3].id
        location = "Seattle, WA"
        employment_type = "FULL_TIME"
        experience_level = "MID"
        is_remote = $true
        salary_min = 100000
        salary_max = 140000
        salary_currency = "USD"
        description = "We're seeking a DevOps Engineer to help scale our cloud infrastructure and improve our CI/CD pipelines. You'll work with modern tools and technologies to ensure reliable, scalable, and secure deployments."
        requirements = @(
            "3+ years of DevOps or SRE experience",
            "Strong experience with AWS or Azure cloud platforms",
            "Proficiency in Infrastructure as Code (Terraform, CloudFormation)",
            "Experience with containerization (Docker, Kubernetes)",
            "Knowledge of CI/CD pipelines and automation tools"
        )
        benefits = @(
            "Competitive compensation package",
            "Remote work flexibility",
            "Health and wellness benefits",
            "Professional certification reimbursement",
            "Modern tech stack and tools"
        )
        skills = @("AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python", "Linux")
        application_deadline = "2025-12-15T23:59:59Z"
    },
    @{
        title = "Frontend Developer"
        company_id = $createdCompanies[0].id
        location = "San Francisco, CA"
        employment_type = "FULL_TIME"
        experience_level = "MID"
        is_remote = $true
        salary_min = 80000
        salary_max = 120000
        salary_currency = "USD"
        description = "Looking for a passionate Frontend Developer to create amazing user experiences. You'll work on our React-based applications, collaborating closely with designers and backend developers."
        requirements = @(
            "3+ years of frontend development experience",
            "Expert knowledge of React and modern JavaScript",
            "Experience with CSS frameworks and responsive design",
            "Understanding of web performance optimization",
            "Familiarity with version control and agile development"
        )
        benefits = @(
            "Competitive salary and stock options",
            "Flexible work arrangements",
            "Comprehensive benefits package",
            "Creative and collaborative environment",
            "Opportunity to work on impactful projects"
        )
        skills = @("React", "JavaScript", "TypeScript", "CSS", "HTML", "Sass", "Git")
        application_deadline = "2025-12-01T23:59:59Z"
    },
    @{
        title = "Healthcare Data Analyst"
        company_id = $createdCompanies[2].id
        location = "Austin, TX"
        employment_type = "FULL_TIME"
        experience_level = "ENTRY"
        is_remote = $false
        salary_min = 60000
        salary_max = 80000
        salary_currency = "USD"
        description = "Join our healthcare analytics team to help improve patient outcomes through data-driven insights. You'll work with healthcare data to identify trends and support clinical decision-making."
        requirements = @(
            "Bachelor's degree in healthcare, statistics, or related field",
            "Experience with data analysis tools and SQL",
            "Knowledge of healthcare regulations and privacy standards",
            "Strong analytical and problem-solving skills",
            "Excellent communication and presentation abilities"
        )
        benefits = @(
            "Competitive entry-level compensation",
            "Health insurance and retirement plans",
            "Professional development opportunities",
            "Meaningful work in healthcare",
            "Supportive team environment"
        )
        skills = @("SQL", "Excel", "Python", "R", "Tableau", "HIPAA", "Statistics")
        application_deadline = "2025-11-15T23:59:59Z"
    }
)

$createdJobs = @()

foreach ($job in $jobs) {
    try {
        $body = $job | ConvertTo-Json -Depth 10
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/jobs" -Method Post -Headers $headers -Body $body
        Write-Host "✅ Created job: $($job.title) at $($createdCompanies | Where-Object { $_.id -eq $job.company_id } | Select-Object -ExpandProperty name)" -ForegroundColor Green
        $createdJobs += $response.job
    } catch {
        Write-Host "❌ Failed to create job: $($job.title) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n📊 Dummy Data Creation Complete!" -ForegroundColor Green
Write-Host "Created $($createdCompanies.Count) companies and $($createdJobs.Count) jobs" -ForegroundColor Cyan

# Export created data for use in simulation
@{
    companies = $createdCompanies
    jobs = $createdJobs
} | ConvertTo-Json -Depth 10 | Out-File -FilePath "dummy-data.json" -Encoding UTF8

Write-Host "Data exported to dummy-data.json" -ForegroundColor Yellow