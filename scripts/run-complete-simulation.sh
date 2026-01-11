#!/bin/bash

# Master Script to Run Complete API Simulation
# This script executes all simulation steps in sequence

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     ApplyMint AI - Complete API Simulation Suite          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This script will:"
echo "  1. Create dummy companies and jobs"
echo "  2. Simulate a complete user journey through the platform"
echo ""

# Check for required tools
command -v curl >/dev/null 2>&1 || { echo "❌ curl is required but not installed. Aborting." >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "❌ jq is required but not installed. Aborting." >&2; exit 1; }

echo "✅ All required tools are available"
echo ""

read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Phase 1: Creating Dummy Data"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ -f "${SCRIPT_DIR}/create-dummy-data.sh" ]; then
    bash "${SCRIPT_DIR}/create-dummy-data.sh"
    echo ""
    echo "✅ Phase 1 Complete - Dummy data created"
else
    echo "❌ create-dummy-data.sh not found in ${SCRIPT_DIR}"
    exit 1
fi

echo ""
echo "Waiting 5 seconds before proceeding to user journey simulation..."
sleep 5

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Phase 2: User Journey Simulation"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ -f "${SCRIPT_DIR}/user-journey-simulation.sh" ]; then
    bash "${SCRIPT_DIR}/user-journey-simulation.sh"
    echo ""
    echo "✅ Phase 2 Complete - User journey simulated"
else
    echo "❌ user-journey-simulation.sh not found in ${SCRIPT_DIR}"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           🎉 API SIMULATION COMPLETED SUCCESSFULLY 🎉      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Summary of completed actions:"
echo "  ✅ Companies created"
echo "  ✅ Jobs posted"
echo "  ✅ User registered and authenticated"
echo "  ✅ User profile created"
echo "  ✅ Resume created with work experiences and skills"
echo "  ✅ Job application submitted"
echo "  ✅ Job saved for later"
echo "  ✅ Job alerts configured"
echo ""
echo "All API endpoints have been tested and verified!"
echo ""
