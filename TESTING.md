# Testing Documentation

This document outlines the testing strategy and implementation for the MaxERP Leave Management System.

## Test Structure

### Unit Tests

-   **Location**: `tests/Unit/`
-   **Purpose**: Test individual classes and methods in isolation
-   **Focus**: Business logic, validation, and data processing

### Feature Tests

-   **Location**: `tests/Feature/`
-   **Purpose**: Test complete user workflows and API endpoints
-   **Focus**: Integration testing, authentication, and end-to-end scenarios

## Test Coverage

### LeaveValidationService (Unit Tests)

Tests the core business logic for leave request validation:

#### Date Validation Tests

-   ✅ Valid future dates
-   ✅ Past dates (should fail)
-   ✅ Today as start date (should pass)
-   ✅ Invalid date ranges (end before start)

#### Overlap Detection Tests

-   ✅ No existing requests (should pass)
-   ✅ Overlapping approved requests (should fail)
-   ✅ Rejected requests (should not block new requests)
-   ✅ Non-overlapping requests (should pass)

#### Leave Balance Tests

-   ✅ Sufficient balance (should pass)
-   ✅ Insufficient balance (should fail)
-   ✅ No balance record (should fail)
-   ✅ Exact remaining balance (should pass)

#### Balance Retrieval Tests

-   ✅ Get balances for user
-   ✅ No balances found
-   ✅ Specific year filtering

### LeaveRequestApiTest (Feature Tests)

Tests the complete API workflow:

#### Employee Workflows

-   ✅ Submit leave request
-   ✅ View leave balances
-   ✅ View own leave requests
-   ✅ Past date validation
-   ✅ Insufficient balance validation

#### Manager Workflows

-   ✅ View pending requests
-   ✅ Approve leave requests
-   ✅ Reject leave requests

#### Security Tests

-   ✅ Unauthorized access to manager endpoints
-   ✅ Unauthenticated access rejection

## Running Tests

### Run All Tests

```bash
php artisan test
```

### Run Specific Test Suites

```bash
# Unit tests only
php artisan test tests/Unit/

# Feature tests only
php artisan test tests/Feature/

# Specific test file
php artisan test tests/Unit/LeaveValidationServiceTest.php
```

### Run with Coverage

```bash
php artisan test --coverage
```

## Test Data Setup

### Database Seeding

Tests use `RefreshDatabase` trait to ensure clean state:

-   Creates test users (employee and manager)
-   Sets up leave balances
-   Creates leave requests as needed

### User Roles

-   **Employee**: Can submit requests, view balances
-   **Manager**: Can approve/reject requests, view team status

### Leave Types

-   **Vacation**: 20 days per year
-   **Sick**: 10 days per year
-   **Personal**: 5 days per year

## Test Assertions

### Unit Test Assertions

-   `assertTrue()` / `assertFalse()` for boolean returns
-   `assertEquals()` for exact value matching
-   `assertCount()` for array/collection sizes
-   `assertNotNull()` for object existence

### Feature Test Assertions

-   `assertStatus()` for HTTP response codes
-   `assertJson()` for API response structure
-   `assertDatabaseHas()` for database state verification
-   `assertJsonCount()` for array sizes in responses

## Best Practices

### Test Naming

-   Descriptive test method names
-   Clear test documentation
-   Grouped by functionality

### Test Isolation

-   Each test is independent
-   Clean database state
-   No shared test data

### Coverage Goals

-   **Unit Tests**: 100% method coverage for business logic
-   **Feature Tests**: All API endpoints and user workflows
-   **Edge Cases**: Error conditions and boundary values

## Future Test Additions

### Frontend Tests (Cypress)

-   User interface workflows
-   Form validation
-   Navigation testing

### Performance Tests

-   API response times
-   Database query optimization
-   Concurrent user scenarios

### Security Tests

-   Authentication bypass attempts
-   Authorization boundary testing
-   Input validation edge cases
