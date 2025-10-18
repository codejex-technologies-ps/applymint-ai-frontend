#!/bin/bash

# Create Dummy Data for ApplyMint AI Simulation
# This script creates sample companies and jobs for testing

# Read from .env.local if available, otherwise use defaults
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://pidjubyaqzoitmbixzbf.supabase.co}"
SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGp1YnlhcXpvaXRtYml4emJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzE2NDcsImV4cCI6MjA2NjgwNzY0N30.Gy3ugh0LbT58rXbjQuhBLWSmetx_2yWvMf1qDBKEJMs}"

echo "📊 Creating Dummy Data for ApplyMint AI"
echo "=========================================="

# Create Companies
echo ""
echo "🏢 Creating Companies..."

# Store company IDs
declare -a COMPANY_IDS

# Company 1: TechCorp Solutions
response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/companies" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TechCorp Solutions",
    "industry": "Technology",
    "size": "MEDIUM",
    "location": "San Francisco, CA",
    "description": "Leading technology solutions provider specializing in AI and machine learning.",
    "website": "https://techcorp.com",
    "logo_url": "https://example.com/logos/techcorp.png"
  }')

if echo "$response" | jq -e '.company.id' > /dev/null 2>&1; then
    COMPANY_IDS[0]=$(echo "$response" | jq -r '.company.id')
    echo "✅ Created company: TechCorp Solutions (ID: ${COMPANY_IDS[0]})"
else
    echo "❌ Failed to create company: TechCorp Solutions"
    echo "Response: $response"
fi

# Company 2: DataFlow Systems
response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/companies" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DataFlow Systems",
    "industry": "Technology",
    "size": "LARGE",
    "location": "New York, NY",
    "description": "Enterprise data management and analytics platform.",
    "website": "https://dataflow.com",
    "logo_url": "https://example.com/logos/dataflow.png"
  }')

if echo "$response" | jq -e '.company.id' > /dev/null 2>&1; then
    COMPANY_IDS[1]=$(echo "$response" | jq -r '.company.id')
    echo "✅ Created company: DataFlow Systems (ID: ${COMPANY_IDS[1]})"
else
    echo "❌ Failed to create company: DataFlow Systems"
fi

# Company 3: InnovateLabs
response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/companies" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "InnovateLabs",
    "industry": "Healthcare",
    "size": "SMALL",
    "location": "Austin, TX",
    "description": "Healthcare technology startup focused on patient data analytics.",
    "website": "https://innovatelabs.com",
    "logo_url": "https://example.com/logos/innovatelabs.png"
  }')

if echo "$response" | jq -e '.company.id' > /dev/null 2>&1; then
    COMPANY_IDS[2]=$(echo "$response" | jq -r '.company.id')
    echo "✅ Created company: InnovateLabs (ID: ${COMPANY_IDS[2]})"
else
    echo "❌ Failed to create company: InnovateLabs"
fi

# Company 4: CloudSync Inc
response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/companies" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CloudSync Inc",
    "industry": "Technology",
    "size": "MEDIUM",
    "location": "Seattle, WA",
    "description": "Cloud infrastructure and DevOps solutions provider.",
    "website": "https://cloudsync.com",
    "logo_url": "https://example.com/logos/cloudsync.png"
  }')

if echo "$response" | jq -e '.company.id' > /dev/null 2>&1; then
    COMPANY_IDS[3]=$(echo "$response" | jq -r '.company.id')
    echo "✅ Created company: CloudSync Inc (ID: ${COMPANY_IDS[3]})"
else
    echo "❌ Failed to create company: CloudSync Inc"
fi

# Create Jobs
echo ""
echo "💼 Creating Jobs..."

# Job 1: Senior Full Stack Developer
if [ ! -z "${COMPANY_IDS[0]}" ]; then
    response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/jobs" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Senior Full Stack Developer\",
        \"company_id\": \"${COMPANY_IDS[0]}\",
        \"location\": \"San Francisco, CA\",
        \"job_type\": \"FULL_TIME\",
        \"experience_level\": \"SENIOR\",
        \"is_remote\": true,
        \"salary_min\": 120000,
        \"salary_max\": 180000,
        \"salary_currency\": \"USD\",
        \"description\": \"We are looking for a Senior Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies including React, Node.js, and cloud services.\",
        \"requirements\": [
          \"5+ years of experience in full stack development\",
          \"Strong proficiency in React, Node.js, and TypeScript\",
          \"Experience with cloud platforms (AWS/Azure/GCP)\",
          \"Knowledge of database design and SQL\",
          \"Experience with RESTful APIs and GraphQL\"
        ],
        \"benefits\": [
          \"Competitive salary and equity package\",
          \"Health, dental, and vision insurance\",
          \"Flexible work hours and remote work options\",
          \"Professional development budget\",
          \"Modern equipment and tools\"
        ],
        \"skills\": [\"React\", \"Node.js\", \"TypeScript\", \"AWS\", \"PostgreSQL\", \"GraphQL\", \"Docker\"],
        \"application_deadline\": \"2025-12-31T23:59:59Z\"
      }")
    
    if echo "$response" | jq -e '.job.id' > /dev/null 2>&1; then
        echo "✅ Created job: Senior Full Stack Developer at TechCorp Solutions"
    else
        echo "❌ Failed to create job: Senior Full Stack Developer"
    fi
fi

# Job 2: Data Scientist
if [ ! -z "${COMPANY_IDS[1]}" ]; then
    response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/jobs" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Data Scientist\",
        \"company_id\": \"${COMPANY_IDS[1]}\",
        \"location\": \"New York, NY\",
        \"job_type\": \"FULL_TIME\",
        \"experience_level\": \"MID\",
        \"is_remote\": false,
        \"salary_min\": 90000,
        \"salary_max\": 130000,
        \"salary_currency\": \"USD\",
        \"description\": \"Join our data science team to work on cutting-edge machine learning projects. You'll analyze large datasets, build predictive models, and help drive data-driven decision making across the organization.\",
        \"requirements\": [
          \"3+ years of experience in data science or machine learning\",
          \"Strong programming skills in Python and R\",
          \"Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)\",
          \"Proficiency in SQL and data visualization tools\",
          \"Statistical analysis and hypothesis testing knowledge\"
        ],
        \"benefits\": [
          \"Competitive salary with performance bonuses\",
          \"Comprehensive health benefits\",
          \"Learning and development opportunities\",
          \"Flexible PTO policy\",
          \"Collaborative work environment\"
        ],
        \"skills\": [\"Python\", \"R\", \"SQL\", \"TensorFlow\", \"scikit-learn\", \"Tableau\", \"Statistics\"],
        \"application_deadline\": \"2025-11-30T23:59:59Z\"
      }")
    
    if echo "$response" | jq -e '.job.id' > /dev/null 2>&1; then
        echo "✅ Created job: Data Scientist at DataFlow Systems"
    else
        echo "❌ Failed to create job: Data Scientist"
    fi
fi

# Job 3: DevOps Engineer
if [ ! -z "${COMPANY_IDS[3]}" ]; then
    response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/jobs" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"DevOps Engineer\",
        \"company_id\": \"${COMPANY_IDS[3]}\",
        \"location\": \"Seattle, WA\",
        \"job_type\": \"FULL_TIME\",
        \"experience_level\": \"MID\",
        \"is_remote\": true,
        \"salary_min\": 100000,
        \"salary_max\": 140000,
        \"salary_currency\": \"USD\",
        \"description\": \"We're seeking a DevOps Engineer to help scale our cloud infrastructure and improve our CI/CD pipelines. You'll work with modern tools and technologies to ensure reliable, scalable, and secure deployments.\",
        \"requirements\": [
          \"3+ years of DevOps or SRE experience\",
          \"Strong experience with AWS or Azure cloud platforms\",
          \"Proficiency in Infrastructure as Code (Terraform, CloudFormation)\",
          \"Experience with containerization (Docker, Kubernetes)\",
          \"Knowledge of CI/CD pipelines and automation tools\"
        ],
        \"benefits\": [
          \"Competitive compensation package\",
          \"Remote work flexibility\",
          \"Health and wellness benefits\",
          \"Professional certification reimbursement\",
          \"Modern tech stack and tools\"
        ],
        \"skills\": [\"AWS\", \"Docker\", \"Kubernetes\", \"Terraform\", \"Jenkins\", \"Python\", \"Linux\"],
        \"application_deadline\": \"2025-12-15T23:59:59Z\"
      }")
    
    if echo "$response" | jq -e '.job.id' > /dev/null 2>&1; then
        echo "✅ Created job: DevOps Engineer at CloudSync Inc"
    else
        echo "❌ Failed to create job: DevOps Engineer"
    fi
fi

# Job 4: Frontend Developer
if [ ! -z "${COMPANY_IDS[0]}" ]; then
    response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/jobs" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Frontend Developer\",
        \"company_id\": \"${COMPANY_IDS[0]}\",
        \"location\": \"San Francisco, CA\",
        \"job_type\": \"FULL_TIME\",
        \"experience_level\": \"MID\",
        \"is_remote\": true,
        \"salary_min\": 80000,
        \"salary_max\": 120000,
        \"salary_currency\": \"USD\",
        \"description\": \"Looking for a passionate Frontend Developer to create amazing user experiences. You'll work on our React-based applications, collaborating closely with designers and backend developers.\",
        \"requirements\": [
          \"3+ years of frontend development experience\",
          \"Expert knowledge of React and modern JavaScript\",
          \"Experience with CSS frameworks and responsive design\",
          \"Understanding of web performance optimization\",
          \"Familiarity with version control and agile development\"
        ],
        \"benefits\": [
          \"Competitive salary and stock options\",
          \"Flexible work arrangements\",
          \"Comprehensive benefits package\",
          \"Creative and collaborative environment\",
          \"Opportunity to work on impactful projects\"
        ],
        \"skills\": [\"React\", \"JavaScript\", \"TypeScript\", \"CSS\", \"HTML\", \"Sass\", \"Git\"],
        \"application_deadline\": \"2025-12-01T23:59:59Z\"
      }")
    
    if echo "$response" | jq -e '.job.id' > /dev/null 2>&1; then
        echo "✅ Created job: Frontend Developer at TechCorp Solutions"
    else
        echo "❌ Failed to create job: Frontend Developer"
    fi
fi

# Job 5: Healthcare Data Analyst
if [ ! -z "${COMPANY_IDS[2]}" ]; then
    response=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/jobs" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Healthcare Data Analyst\",
        \"company_id\": \"${COMPANY_IDS[2]}\",
        \"location\": \"Austin, TX\",
        \"job_type\": \"FULL_TIME\",
        \"experience_level\": \"ENTRY\",
        \"is_remote\": false,
        \"salary_min\": 60000,
        \"salary_max\": 80000,
        \"salary_currency\": \"USD\",
        \"description\": \"Join our healthcare analytics team to help improve patient outcomes through data-driven insights. You'll work with healthcare data to identify trends and support clinical decision-making.\",
        \"requirements\": [
          \"Bachelor's degree in healthcare, statistics, or related field\",
          \"Experience with data analysis tools and SQL\",
          \"Knowledge of healthcare regulations and privacy standards\",
          \"Strong analytical and problem-solving skills\",
          \"Excellent communication and presentation abilities\"
        ],
        \"benefits\": [
          \"Competitive entry-level compensation\",
          \"Health insurance and retirement plans\",
          \"Professional development opportunities\",
          \"Meaningful work in healthcare\",
          \"Supportive team environment\"
        ],
        \"skills\": [\"SQL\", \"Excel\", \"Python\", \"R\", \"Tableau\", \"HIPAA\", \"Statistics\"],
        \"application_deadline\": \"2025-11-15T23:59:59Z\"
      }")
    
    if echo "$response" | jq -e '.job.id' > /dev/null 2>&1; then
        echo "✅ Created job: Healthcare Data Analyst at InnovateLabs"
    else
        echo "❌ Failed to create job: Healthcare Data Analyst"
    fi
fi

echo ""
echo "📊 Dummy Data Creation Complete!"
echo "Created companies and jobs successfully"
