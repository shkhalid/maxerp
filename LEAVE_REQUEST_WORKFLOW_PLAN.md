# Leave Request Workflow System - Development Plan

## 🎯 Project Overview

Building a Leave Request Workflow for SaaS HR platform using Laravel 12 + Inertia.js + React with TypeScript.

## 🏗️ Tech Stack

-   **Backend**: Laravel 12.33.0
-   **Frontend**: React 19.2.0 + TypeScript
-   **Routing**: Inertia.js 2.0
-   **Styling**: Tailwind CSS + Radix UI Components
-   **Database**: SQLite (real database)
-   **Authentication**: Session-based (Laravel Auth)
-   **Testing**: PHPUnit + Cypress

## 📋 Requirements Analysis

### Core Features

1. **Employee Features**

    - Submit leave requests with date validation
    - View leave balance
    - View request history

2. **Manager Features**

    - View pending requests
    - Approve/reject requests
    - Check leave balances before approval

3. **System Features**
    - Role-based access control
    - Date validation (no past dates, no overlaps)
    - Leave balance validation
    - Mock data for users and leave balances

## 🗄️ Database Schema

### Users Table (Existing)

```sql
- id (primary key)
- name
- email
- password
- role (employee|manager)
- created_at
- updated_at
```

### Leave Requests Table

```sql
- id (primary key)
- user_id (foreign key)
- leave_type (sick|vacation|personal)
- start_date
- end_date
- days_requested
- reason
- status (pending|approved|rejected)
- approved_by (foreign key to users)
- approved_at
- created_at
- updated_at
```

### Leave Balances Table

```sql
- id (primary key)
- user_id (foreign key)
- leave_type (sick|vacation|personal)
- total_days
- used_days
- remaining_days
- year
- created_at
- updated_at
```

## 🎨 Frontend Components Structure

### Pages

```
resources/js/Pages/
├── Auth/
│   ├── Login.tsx (existing)
│   └── Register.tsx (existing)
├── Employee/
│   ├── Dashboard.tsx
│   ├── LeaveRequest.tsx
│   └── LeaveHistory.tsx
├── Manager/
│   ├── Dashboard.tsx
│   └── PendingRequests.tsx
└── Shared/
    └── Layout.tsx
```

### Components

```
resources/js/components/
├── ui/ (existing Radix UI components)
├── forms/
│   ├── LeaveRequestForm.tsx
│   └── LeaveApprovalForm.tsx
├── cards/
│   ├── LeaveRequestCard.tsx
│   └── LeaveBalanceCard.tsx
└── layout/
    ├── Header.tsx (existing)
    └── Sidebar.tsx
```

## 🛠️ Backend Implementation Plan

### 1. Models

```php
// app/Models/LeaveRequest.php
class LeaveRequest extends Model
{
    protected $fillable = [
        'user_id', 'leave_type', 'start_date', 'end_date',
        'days_requested', 'reason', 'status', 'approved_by', 'approved_at'
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function approver() { return $this->belongsTo(User::class, 'approved_by'); }
}

// app/Models/LeaveBalance.php
class LeaveBalance extends Model
{
    protected $fillable = [
        'user_id', 'leave_type', 'total_days', 'used_days', 'remaining_days', 'year'
    ];

    public function user() { return $this->belongsTo(User::class); }
}
```

### 2. Controllers

```php
// app/Http/Controllers/LeaveRequestController.php
class LeaveRequestController extends Controller
{
    public function apply(Request $request) // POST /leave/apply
    public function pending() // GET /leave/pending
    public function approve(Request $request, $id) // POST /leave/approve/:id
    public function history() // GET /leave/history
    public function summary() // GET /leave/summary (bonus)
}

// app/Http/Controllers/EmployeeController.php
class EmployeeController extends Controller
{
    public function dashboard() // Employee dashboard
    public function leaveBalance() // Get leave balance
}

// app/Http/Controllers/ManagerController.php
class ManagerController extends Controller
{
    public function dashboard() // Manager dashboard
    public function pendingRequests() // Pending requests view
}
```

### 3. Services

```php
// app/Services/LeaveValidationService.php
class LeaveValidationService
{
    public function validateDates($startDate, $endDate)
    public function checkOverlaps($userId, $startDate, $endDate)
    public function validateLeaveBalance($userId, $daysRequested, $leaveType)
}
```

## 🧪 Testing Strategy

### Cypress Setup

```bash
# Install Cypress
npm install --save-dev cypress

# Add to package.json scripts
"cypress:open": "cypress open",
"cypress:run": "cypress run"
```

### Cypress Configuration

```typescript
// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "https://maxerp.test",
        supportFile: "cypress/support/e2e.ts",
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true,
        screenshotOnRunFailure: true,
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
    },
});
```

### Backend Tests

```php
// tests/Feature/LeaveRequestTest.php
class LeaveRequestTest extends TestCase
{
    public function test_employee_can_apply_for_leave()
    public function test_manager_can_approve_leave()
    public function test_date_validation_prevents_past_dates()
    public function test_overlap_validation_prevents_conflicts()
    public function test_leave_balance_validation()
}
```

### Frontend Tests (Cypress)

```typescript
// cypress/e2e/leave-request.cy.ts
describe("Leave Request Workflow", () => {
    beforeEach(() => {
        cy.loginAsEmployee();
        cy.visit("/employee/dashboard");
    });

    it("should allow employee to submit leave request", () => {
        cy.get('[data-testid="leave-request-form"]').should("be.visible");
        cy.get('[data-testid="start-date"]').type("2024-02-01");
        cy.get('[data-testid="end-date"]').type("2024-02-05");
        cy.get('[data-testid="leave-type"]').select("vacation");
        cy.get('[data-testid="reason"]').type("Family vacation");
        cy.get('[data-testid="submit-request"]').click();
        cy.get('[data-testid="success-message"]').should(
            "contain",
            "Leave request submitted"
        );
    });

    it("should validate form fields and prevent past dates", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const pastDate = yesterday.toISOString().split("T")[0];

        cy.get('[data-testid="start-date"]').type(pastDate);
        cy.get('[data-testid="submit-request"]').click();
        cy.get('[data-testid="error-message"]').should(
            "contain",
            "Cannot select past dates"
        );
    });

    it("should show different UI based on user role", () => {
        cy.loginAsManager();
        cy.visit("/manager/dashboard");
        cy.get('[data-testid="pending-requests"]').should("be.visible");
        cy.get('[data-testid="approve-button"]').should("exist");
    });
});

// cypress/e2e/employee-dashboard.cy.ts
describe("Employee Dashboard", () => {
    beforeEach(() => {
        cy.loginAsEmployee();
    });

    it("should display leave balance cards", () => {
        cy.visit("/employee/dashboard");
        cy.get('[data-testid="vacation-balance"]').should(
            "contain",
            "15 days remaining"
        );
        cy.get('[data-testid="sick-balance"]').should(
            "contain",
            "8 days remaining"
        );
    });

    it("should show leave request form", () => {
        cy.visit("/employee/dashboard");
        cy.get('[data-testid="leave-request-form"]').should("be.visible");
        cy.get('[data-testid="start-date"]').should("exist");
        cy.get('[data-testid="end-date"]').should("exist");
        cy.get('[data-testid="leave-type"]').should("exist");
    });

    it("should display request history", () => {
        cy.visit("/employee/dashboard");
        cy.get('[data-testid="request-history"]').should("be.visible");
        cy.get('[data-testid="request-item"]').should(
            "have.length.at.least",
            1
        );
    });
});

// cypress/e2e/manager-dashboard.cy.ts
describe("Manager Dashboard", () => {
    beforeEach(() => {
        cy.loginAsManager();
    });

    it("should display pending requests", () => {
        cy.visit("/manager/dashboard");
        cy.get('[data-testid="pending-requests"]').should("be.visible");
        cy.get('[data-testid="request-item"]').should(
            "have.length.at.least",
            1
        );
    });

    it("should allow approve/reject actions", () => {
        cy.visit("/manager/dashboard");
        cy.get('[data-testid="approve-button"]').first().click();
        cy.get('[data-testid="approval-modal"]').should("be.visible");
        cy.get('[data-testid="confirm-approve"]').click();
        cy.get('[data-testid="success-message"]').should(
            "contain",
            "Request approved"
        );
    });

    it("should show employee details", () => {
        cy.visit("/manager/dashboard");
        cy.get('[data-testid="employee-name"]').should("be.visible");
        cy.get('[data-testid="employee-email"]').should("be.visible");
        cy.get('[data-testid="leave-balance"]').should("be.visible");
    });
});

// cypress/support/commands.ts
declare global {
    namespace Cypress {
        interface Chainable {
            loginAsEmployee(): Chainable<void>;
            loginAsManager(): Chainable<void>;
        }
    }
}

Cypress.Commands.add("loginAsEmployee", () => {
    cy.session("employee", () => {
        cy.visit("/login");
        cy.get('[data-testid="email"]').type("employee@company.com");
        cy.get('[data-testid="password"]').type("password");
        cy.get('[data-testid="login-button"]').click();
        cy.url().should("include", "/employee/dashboard");
    });
});

Cypress.Commands.add("loginAsManager", () => {
    cy.session("manager", () => {
        cy.visit("/login");
        cy.get('[data-testid="email"]').type("manager@company.com");
        cy.get('[data-testid="password"]').type("password");
        cy.get('[data-testid="login-button"]').click();
        cy.url().should("include", "/manager/dashboard");
    });
});
```

## 🚀 Implementation Phases

### Phase 1: Database & Models (30 mins)

1. Create migrations for leave_requests and leave_balances tables
2. Create models with relationships
3. Seed mock data for users and leave balances

### Phase 2: Backend API (60 mins)

1. Create LeaveRequestController with all endpoints
2. Implement validation services
3. Add role-based middleware
4. Create API routes

### Phase 3: Frontend Pages (90 mins)

1. Employee dashboard with leave request form
2. Manager dashboard with pending requests
3. Leave history and balance views
4. Role-based navigation

### Phase 4: Testing & Polish (30 mins)

1. Write unit tests for validation logic
2. Add Cypress E2E tests for user workflows
3. Test role-based access and UI rendering
4. Polish UI/UX

## 📝 API Endpoints

### Employee Endpoints

```
POST /leave/apply
GET /leave/history
GET /leave/balance
GET /employee/dashboard
```

### Manager Endpoints

```
GET /leave/pending
POST /leave/approve/:id
GET /manager/dashboard
```

### Bonus Endpoint

```
GET /leave/summary
```

## 🎨 UI/UX Design

### Employee Interface

-   Clean dashboard with leave balance cards
-   Intuitive leave request form with date picker
-   Request history with status indicators
-   Real-time validation feedback

### Manager Interface

-   Pending requests list with employee details
-   Quick approve/reject actions
-   Leave balance checks before approval
-   Summary statistics

## 🔒 Security Considerations

1. **Role-based Access Control**

    - Middleware to ensure only managers can approve
    - Route protection based on user roles

2. **Data Validation**

    - Server-side validation for all inputs
    - Date range validation
    - Leave balance verification

3. **CSRF Protection**
    - Laravel's built-in CSRF protection
    - Secure form submissions

## 📊 Mock Data Structure

### Sample Users

```php
[
    ['name' => 'John Employee', 'email' => 'john@company.com', 'role' => 'employee'],
    ['name' => 'Jane Manager', 'email' => 'jane@company.com', 'role' => 'manager'],
    // ... more users
]
```

### Sample Leave Balances

```php
[
    ['user_id' => 1, 'leave_type' => 'vacation', 'total_days' => 20, 'used_days' => 5],
    ['user_id' => 1, 'leave_type' => 'sick', 'total_days' => 10, 'used_days' => 2],
    // ... more balances
]
```

## 🚀 Deployment Considerations

1. **Environment Setup**

    - Laravel Herd for local development
    - SQLite database for simplicity
    - Vite for asset compilation

2. **Performance**
    - Efficient database queries
    - Proper indexing on foreign keys
    - Caching for frequently accessed data

## 📋 Success Criteria

### Functional Requirements ✅

-   [ ] Employees can submit leave requests
-   [ ] Managers can approve/reject requests
-   [ ] Date validation prevents past dates and overlaps
-   [ ] Leave balance validation before approval
-   [ ] Role-based UI rendering

### Technical Requirements ✅

-   [ ] Clean, reusable components
-   [ ] TypeScript types for API responses
-   [ ] Unit tests for validation logic
-   [ ] Cypress E2E tests for user workflows
-   [ ] Comprehensive README.md

### Bonus Features ✅

-   [ ] Monthly leave summary endpoint
-   [ ] TypeScript types for all API responses
-   [ ] Advanced UI animations and interactions

## 📚 Documentation Deliverables

1. **README.md** with:

    - Setup instructions
    - API documentation
    - Assumptions and approach explanation
    - Testing instructions

2. **Code Documentation**
    - Inline comments for complex logic
    - TypeScript interfaces and types
    - API endpoint documentation

## ⏱️ Time Allocation

-   **Database & Models**: 30 minutes
-   **Backend API**: 60 minutes
-   **Frontend Development**: 90 minutes
-   **Testing**: 30 minutes
-   **Documentation**: 15 minutes
-   **Total**: ~4 hours

## 🎯 Key Success Factors

1. **Clean Architecture**: Separation of concerns between controllers, services, and models
2. **Reusable Components**: Leveraging existing Radix UI components
3. **Type Safety**: Full TypeScript implementation
4. **User Experience**: Intuitive interfaces for both employees and managers
5. **Code Quality**: Comprehensive testing and documentation

---

_This plan provides a comprehensive roadmap for building a professional Leave Request Workflow system that meets all requirements while leveraging the existing Laravel 12 + Inertia.js + React setup._
