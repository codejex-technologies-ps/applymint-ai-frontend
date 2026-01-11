#!/bin/bash

# Test API Connectivity
# This script tests basic connectivity to Supabase APIs

SUPABASE_URL="https://pidjubyaqzoitmbixzbf.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZGp1YnlhcXpvaXRtYml4emJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzE2NDcsImV4cCI6MjA2NjgwNzY0N30.Gy3ugh0LbT58rXbjQuhBLWSmetx_2yWvMf1qDBKEJMs"

echo "🧪 Testing ApplyMint AI API Connectivity"
echo "========================================="
echo ""

# Test 1: Check Supabase Functions - Jobs endpoint
echo "Test 1: Checking /functions/v1/jobs endpoint..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "${SUPABASE_URL}/functions/v1/jobs?page=1&limit=5" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json")

http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')

if [ "$http_status" = "200" ]; then
    echo "✅ Jobs endpoint is accessible"
    if echo "$body" | jq -e '.jobs' > /dev/null 2>&1; then
        job_count=$(echo "$body" | jq -r '.jobs | length')
        echo "   Found $job_count existing jobs"
    else
        echo "   Response received but format unexpected"
        echo "   Response: $body"
    fi
else
    echo "❌ Jobs endpoint failed with status: $http_status"
    echo "   Response: $body"
fi

echo ""

# Test 2: Check Supabase Functions - Companies endpoint
echo "Test 2: Checking /functions/v1/companies endpoint..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "${SUPABASE_URL}/functions/v1/companies?page=1&limit=5" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json")

http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_STATUS/d')

if [ "$http_status" = "200" ]; then
    echo "✅ Companies endpoint is accessible"
    if echo "$body" | jq -e '.companies' > /dev/null 2>&1; then
        company_count=$(echo "$body" | jq -r '.companies | length')
        echo "   Found $company_count existing companies"
    else
        echo "   Response received but format unexpected"
        echo "   Response: $body"
    fi
else
    echo "❌ Companies endpoint failed with status: $http_status"
    echo "   Response: $body"
fi

echo ""

# Test 3: Check Supabase Auth endpoint
echo "Test 3: Checking Supabase Auth availability..."
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "${SUPABASE_URL}/auth/v1/health" \
    -H "apikey: ${SUPABASE_ANON_KEY}")

http_status=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$http_status" = "200" ]; then
    echo "✅ Auth endpoint is healthy"
else
    echo "⚠️  Auth health check returned status: $http_status"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "API Connectivity Test Complete"
echo "═══════════════════════════════════════════════"
echo ""
echo "Summary:"
echo "  Supabase URL: $SUPABASE_URL"
echo "  All endpoints tested"
echo ""
