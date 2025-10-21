# Cypress E2E Tests

This directory contains end-to-end tests for the MaxERP Leave Management System using Cypress.

## Test Structure

### Test Files

-   `cypress/e2e/leave-form.cy.js` - Tests for the leave request form functionality

### Support Files

-   `cypress/support/commands.js` - Custom Cypress commands
-   `cypress/support/e2e.js` - Global test configuration
-   `cypress/fixtures/users.json` - Test user data

## Running Tests

### Open Cypress Test Runner

```bash
npm run cypress:open
```

### Run Tests in Headless Mode

```bash
npm run cypress:run
```

### Run Tests with Chrome Browser

```bash
npm run test:e2e
```

## Test Coverage

### Leave Form Tests

-   ✅ **Form Validation**: Required fields, date validation, range validation
-   ✅ **Form Submission**: Success scenarios, error handling, loading states
-   ✅ **Form Reset**: Cancel functionality, post-submission reset
-   ✅ **User Experience**: Labels, placeholders, date constraints

### Test Scenarios

1. **Validation Tests**

    - Empty form submission
    - Required field validation
    - Past date prevention
    - Date range logic

2. **Submission Tests**

    - Successful form submission
    - API error handling
    - Loading state verification

3. **Reset Tests**

    - Form cancellation
    - Post-submission reset

4. **UX Tests**
    - Form labels and placeholders
    - Date input constraints
    - Dynamic date validation

## Prerequisites

### Application Setup

-   Laravel application running at `https://maxerp.test`
-   Test users created in database
-   Leave balances seeded for test users

### Test Users

-   **Employee**: `employee@company.com` / `password`
-   **Manager**: `manager@company.com` / `password`

## Custom Commands

### `cy.loginAs(role)`

Logs in as a specific user role (employee or manager)

### `cy.fillLeaveForm(formData)`

Fills the leave request form with provided data

### `cy.submitLeaveForm()`

Submits the leave request form

### `cy.waitForApi(method, url)`

Waits for a specific API call to complete

## Test Data

### Form Data Structure

```javascript
{
  leaveType: 'Vacation', // or 'Sick Leave', 'Personal'
  startDate: '2025-10-22', // YYYY-MM-DD format
  endDate: '2025-10-24',   // YYYY-MM-DD format
  reason: 'Family vacation'
}
```

## Best Practices

### Test Isolation

-   Each test logs in fresh
-   Tests don't depend on each other
-   Clean state between tests

### Selectors

-   Use `data-testid` attributes for reliable element selection
-   Avoid brittle CSS selectors
-   Prefer semantic selectors

### Assertions

-   Test user-visible behavior
-   Verify API interactions
-   Check loading states and error messages

## Debugging

### Screenshots and Videos

-   Screenshots taken on test failures
-   Videos recorded for debugging (can be disabled)
-   Console logs captured

### Common Issues

-   **Timeout errors**: Increase `defaultCommandTimeout` in config
-   **Element not found**: Check if `data-testid` attributes are present
-   **API mocking**: Ensure intercepts are set up before actions

## Future Enhancements

### Additional Test Suites

-   Manager dashboard tests
-   Leave approval workflow tests
-   Navigation and routing tests
-   Mobile responsiveness tests

### Performance Tests

-   Form submission performance
-   Large dataset handling
-   Concurrent user scenarios
