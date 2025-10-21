# MaxERP - Leave Management System

A modern HR leave management system built with Laravel 12 and React, featuring role-based access control, real-time notifications, and an intuitive user interface.

## Project Information

-   **Laravel Version**: 12.33.0
-   **PHP Version**: ^8.2
-   **Authentication**: Session-based authentication
-   **Database**: SQLite (default)
-   **Development Server**: Laravel Herd (https://maxerp.test)

## Features

### Core Functionality

-   **Leave Request Management** - Employees can submit, view, and track leave requests
-   **Manager Approval Workflow** - Managers can review, approve, or reject leave requests
-   **Leave Balance Tracking** - Real-time tracking of vacation, sick, and personal leave balances
-   **Role-Based Access Control** - Separate dashboards for employees and managers
-   **Real-Time Notifications** - Toast notifications for all user actions

### Technical Features

-   **Session Authentication** - Secure session-based authentication system
-   **React with TypeScript** - Modern SPA with full type safety
-   **Inertia.js** - Seamless server-side routing with React
-   **Tailwind CSS** - Utility-first CSS framework with custom components
-   **Radix UI Components** - Accessible, unstyled UI components
-   **Responsive Design** - Mobile-friendly interface
-   **Date Validation** - Frontend and backend validation for leave dates
-   **Loading States** - Skeleton loaders and loading indicators

## Setup Instructions

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js 18+ and npm
-   Laravel Herd (recommended) or PHP built-in server

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd maxerp
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

6. **Build frontend assets**
    ```bash
    npm run build
    ```

### Development Server

**Using Laravel Herd (Recommended):**

-   Configure Herd to point to your project directory
-   Access at: https://maxerp.test

**Using PHP built-in server:**

```bash
php artisan serve
# Access at: http://localhost:8000
```

**Frontend development with hot reload:**

```bash
npm run dev
# Vite dev server: http://localhost:3000
```

## Application Routes

### Public Routes

-   `GET /` - Landing page (accessible to all)
-   `GET /login` - User login page (redirects if authenticated)
-   `GET /register` - User registration page (redirects if authenticated)
-   `POST /login` - Process user login
-   `POST /register` - Process user registration
-   `POST /logout` - Logout user

### Protected Routes (Authentication Required)

-   `GET /dashboard` - Role-based dashboard redirect
-   `GET /employee/dashboard` - Employee dashboard
-   `GET /manager/dashboard` - Manager dashboard
-   `GET /profile` - User profile settings

### API Routes (Session-based Authentication)

-   `POST /api/v1/leave/apply` - Submit leave request (Employee)
-   `GET /api/v1/leave/balances` - Get leave balances (Employee)
-   `GET /api/v1/leave/requests` - Get user's leave requests (Employee)
-   `GET /api/v1/leave/pending` - Get pending requests (Manager)
-   `GET /api/v1/leave/on-leave-today` - Get team members on leave today (Manager)
-   `POST /api/v1/leave/approve/{id}` - Approve/reject leave request (Manager)
-   `GET /api/v1/leave/summary` - Get monthly leave summary (Both)

## Assumptions & Business Rules

### User Roles

-   **Employee**: Can submit leave requests, view their balances and request history
-   **Manager**: Can approve/reject leave requests, view team leave status, see pending requests, access comprehensive monthly analytics

### Leave Types

-   **Vacation**: 20 days per year (default)
-   **Sick Leave**: 10 days per year (default)
-   **Personal**: 5 days per year (default)

### Business Rules

-   Leave requests cannot be submitted for past dates
-   Leave requests cannot overlap with existing approved requests
-   Managers can only approve/reject requests (not edit them)
-   Leave balances are checked before approval
-   All dates are validated on both frontend and backend

### Data Validation

-   Start date must be today or future
-   End date must be after or equal to start date
-   Leave type is required
-   Reason is required for all leave requests
-   No overlapping leave periods for the same user

## Technical Approach

### Architecture Decisions

**Backend (Laravel 12):**

-   **Clean Architecture**: Controllers handle HTTP requests, Services handle business logic
-   **Eloquent ORM**: For database operations with proper relationships
-   **Session Authentication**: Simple, secure authentication without JWT complexity
-   **API Design**: RESTful endpoints with consistent JSON responses
-   **Validation**: Laravel validation rules with custom error messages

**Frontend (React + TypeScript):**

-   **TypeScript Types**: Comprehensive type definitions for all API responses
-   **Component Architecture**: Reusable UI components with proper typing
-   **State Management**: React hooks for local state management
-   **Form Validation**: Client-side validation with TypeScript support
-   **API Integration**: Typed Axios requests with proper error handling
-   **Component-Based**: Reusable UI components with Radix UI primitives
-   **Type Safety**: TypeScript interfaces for API responses and component props
-   **User Experience**: Loading states, error handling, and toast notifications

**Database Design:**

-   **Users Table**: Basic user information with role-based access
-   **Leave Requests**: Core leave request data with status tracking
-   **Leave Balances**: User leave balances by type and year
-   **Relationships**: Proper foreign key constraints and cascading deletes

### Code Organization

```
app/
├── Http/Controllers/
│   ├── AuthController.php          # Authentication logic
│   ├── DashboardController.php     # Role-based routing
│   ├── EmployeeController.php     # Employee dashboard
│   ├── ManagerController.php     # Manager dashboard
│   └── Api/LeaveRequestController.php # Leave management API
├── Models/
│   ├── User.php                    # User model with role support
│   ├── LeaveRequest.php           # Leave request model
│   └── LeaveBalance.php           # Leave balance model
├── Services/
│   └── LeaveValidationService.php  # Business logic for leave validation
└── Http/Middleware/
    └── RedirectIfAuthenticated.php # Guest middleware

resources/js/
├── Pages/
│   ├── Landing.tsx                 # Public landing page
│   ├── Auth/Login.tsx             # Login page
│   ├── Auth/Register.tsx          # Registration page
│   ├── Employee/Dashboard.tsx     # Employee interface
│   └── Manager/Dashboard.tsx      # Manager interface
├── components/
│   ├── ui/                        # Reusable UI components
│   └── Header.tsx                 # Navigation component
└── lib/
    └── dateUtils.ts               # Date formatting utilities
```

## Development

### Running Tests

```bash
# Run PHP tests
php artisan test

# Run frontend tests (when implemented)
npm run test
```

### Database Operations

```bash
# Run migrations
php artisan migrate

# Seed test data
php artisan db:seed

# Reset database
php artisan migrate:fresh --seed
```

### Frontend Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## Frontend Development

### React with Inertia.js Setup

The application uses React with Inertia.js for a modern SPA experience:

-   **React 18 with TypeScript** for type-safe development
-   **Inertia.js** for seamless server-side routing
-   **Tailwind CSS** for styling with custom design system
-   **Radix UI** for accessible, unstyled components
-   **Vite** for fast development and building

### Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production
npm run build
```

### Access the Application

-   **Main Application**: https://maxerp.test
-   **Vite Dev Server**: http://localhost:3000 (for hot reload)
-   **Login Page**: https://maxerp.test/login
-   **Register Page**: https://maxerp.test/register

## Important Notes

### Laravel 12 Specific Changes

-   **NO Kernel.php file** - Laravel 12 doesn't use `app/Http/Kernel.php`
-   Middleware is configured in `bootstrap/app.php`
-   Web routes are in `routes/web.php`
-   Session authentication is properly configured

### Cursor AI Rules

This project includes a `.cursorrules` file that provides specific instructions for Cursor AI to follow Laravel 12 best practices and avoid common mistakes.

## Project Structure

```
├── app/
│   ├── Http/Controllers/
│   │   └── AuthController.php
│   ├── Http/Middleware/
│   │   └── HandleInertiaRequests.php
│   └── Models/
│       └── User.php (implements JWTSubject)
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   └── Landing.tsx (React main page)
│   │   ├── components/ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   └── app.tsx (React entry point)
│   ├── css/
│   │   └── app.css (Tailwind CSS)
│   └── views/
│       └── app.blade.php (Inertia root template)
├── routes/
│   ├── api.php (API routes - minimal usage)
│   └── web.php (Web routes with Inertia and authentication)
├── config/
│   ├── auth.php (Session guard configured)
│   └── session.php (Session configuration)
├── tests/
│   └── Feature/
│       └── AuthTest.php (Authentication tests)
├── bootstrap/
│   └── app.php (Middleware configuration)
├── package.json (React dependencies)
├── vite.config.js (Vite configuration)
├── tailwind.config.js (Tailwind configuration)
├── tsconfig.json (TypeScript configuration)
├── postcss.config.js (PostCSS configuration)
└── .cursorrules (Cursor AI rules for Laravel 12)
```

## Security Features

-   Session-based authentication
-   Password hashing
-   Input validation
-   Protected web routes
-   CSRF protection

## Testing

### Backend Testing

-   **Unit Tests**: `php artisan test tests/Unit/`
-   **Feature Tests**: `php artisan test tests/Feature/`
-   **Test Coverage**: Leave validation, API endpoints, authentication

### Frontend Testing

-   **Cypress E2E Tests**: `npm run test:e2e`
-   **Interactive Mode**: `npm run cypress:open`
-   **Test Coverage**: Form validation, user workflows, API integration
-   **Documentation**: See [FRONTEND_TESTING.md](./FRONTEND_TESTING.md) for complete guide

### Test Runner

-   **All Tests**: `./run-tests.sh`
-   **Backend Only**: `php artisan test`
-   **Frontend Only**: `npm run test:e2e`

All tests are passing and demonstrate the complete system is working correctly.
