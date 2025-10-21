#!/bin/bash

# MaxERP Test Runner Script
# This script runs all tests for the MaxERP Leave Management System

echo "🧪 MaxERP Test Suite Runner"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run tests and display results
run_test_suite() {
    local test_name="$1"
    local command="$2"
    
    echo -e "\n${BLUE}Running $test_name...${NC}"
    echo "Command: $command"
    echo "----------------------------------------"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $test_name PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name FAILED${NC}"
        return 1
    fi
}

# Check if we're in the right directory
if [ ! -f "composer.json" ] || [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the MaxERP project root directory${NC}"
    exit 1
fi

# Initialize counters
total_tests=0
passed_tests=0
failed_tests=0

echo -e "${YELLOW}Starting test execution...${NC}"

# 1. Run PHP Unit Tests
total_tests=$((total_tests + 1))
if run_test_suite "PHP Unit Tests" "php artisan test tests/Unit/LeaveValidationServiceTest.php tests/Feature/LeaveRequestApiTest.php"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
fi

# 2. Run Frontend Build Test
total_tests=$((total_tests + 1))
if run_test_suite "Frontend Build Test" "npm run build"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
fi

# 3. Run Cypress Tests (if available)
if command -v npx &> /dev/null; then
    total_tests=$((total_tests + 1))
    if run_test_suite "Cypress E2E Tests" "npm run test:e2e"; then
        passed_tests=$((passed_tests + 1))
    else
        failed_tests=$((failed_tests + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Cypress not available, skipping E2E tests${NC}"
fi

# Display final results
echo -e "\n${BLUE}Test Results Summary${NC}"
echo "===================="
echo -e "Total Test Suites: $total_tests"
echo -e "${GREEN}Passed: $passed_tests${NC}"
echo -e "${RED}Failed: $failed_tests${NC}"

if [ $failed_tests -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}💥 Some tests failed. Please check the output above.${NC}"
    exit 1
fi
