# MaxERP - Laravel 12 Web Application

This is a Laravel 12 project with simple session-based authentication for managing money committees (Kametis).

## Project Information

-   **Laravel Version**: 12.33.0
-   **PHP Version**: ^8.2
-   **Authentication**: Session-based authentication
-   **Database**: SQLite (default)
-   **Development Server**: Laravel Herd (https://maxerp.test)

## Features

-   **Session Authentication** - Simple and secure session-based authentication
-   **React with TypeScript** - Modern SPA with full type safety
-   **Inertia.js** - Seamless server-side routing
-   **Tailwind CSS** - Utility-first CSS framework with custom components
-   **Radix UI Components** - Accessible, unstyled UI components
-   **User Registration & Login** - Complete authentication flow
-   **Money Committee Management** - Create and manage Kametis (rotating savings groups)
-   **Protected Routes** - Secure web routes with authentication
-   **Responsive Design** - Mobile-friendly interface

## Web Routes

### Authentication Routes

-   `GET /register` - User registration page
-   `POST /register` - Process user registration
-   `GET /login` - User login page
-   `POST /login` - Process user login
-   `POST /logout` - Logout user

### Application Routes

-   `GET /` - Landing page
-   `GET /dashboard` - User dashboard (protected)
-   `GET /kametis` - List user's Kametis (protected)
-   `GET /kametis/create` - Create new Kameti (protected)
-   `GET /kametis/{id}/details` - View Kameti details (protected)

## Development

### Running Tests

```bash
php artisan test
```

### Database Migrations

```bash
php artisan migrate
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

The project includes comprehensive tests for:

-   User registration
-   User login
-   User logout
-   Protected route access
-   Authentication requirements
-   Session management

All tests are passing and demonstrate the session-based authentication system is working correctly.
