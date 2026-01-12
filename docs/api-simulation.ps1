# ApplyMint AI API Simulation Scripts
# This script simulates a complete user journey through the job application process

# Environment variables
$SUPABASE_URL = "https://pidjubyaqzoitmbixzbf.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGp1YnlhcXpvaXRtYml4emJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzE2NDcsImV4cCI6MjA2NjgwNzY0N30.Gy3ugh0LbT58rXbjQuhBLWSmetx_2yWvMf1qDBKEJMs"

$headers = @{
    'apikey' = $SUPABASE_ANON_KEY
    'Content-Type' = 'application/json'
}

Write-Host "🚀 Starting ApplyMint AI API Simulation" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Yellow