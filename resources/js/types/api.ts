/**
 * TypeScript types for MaxERP API responses
 */

// Base API response structure
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

// User types
export interface User {
    id: number;
    name: string;
    email: string;
    role: "employee" | "manager";
    created_at: string;
    updated_at: string;
}

// Leave request types
export interface LeaveRequest {
    id: number;
    user_id: number;
    leave_type: "vacation" | "sick" | "personal";
    start_date: string;
    end_date: string;
    days_requested: number;
    reason: string;
    status: "pending" | "approved" | "rejected";
    approver_id?: number;
    approved_at?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    approver?: User;
}

// Leave balance types
export interface LeaveBalance {
    id: number;
    user_id: number;
    leave_type: "vacation" | "sick" | "personal";
    total_days: number;
    used_days: number;
    remaining_days: number;
    year: number;
    created_at: string;
    updated_at: string;
}

// API response types for specific endpoints
export interface LeaveBalancesResponse {
    success: boolean;
    data: LeaveBalance[];
}

export interface LeaveRequestsResponse {
    success: boolean;
    data: LeaveRequest[];
}

export interface PendingRequestsResponse {
    success: boolean;
    data: LeaveRequest[];
}

export interface OnLeaveTodayResponse {
    success: boolean;
    count: number;
    date: string;
}

// Monthly summary types
export interface StatusSummary {
    count: number;
    total_days: number;
}

export interface TypeSummary {
    count: number;
    total_days: number;
}

export interface DailyBreakdown {
    date: string;
    day_name: string;
    on_leave_count: number;
    on_leave_employees: string[];
}

export interface TeamStats {
    total_employees: number;
    employees_with_leave: number;
    most_common_leave_type?: string;
    average_days_per_request: number;
}

export interface MonthlySummaryData {
    month: string;
    status_summary: Record<string, StatusSummary>;
    type_summary: Record<string, TypeSummary>;
    daily_breakdown: DailyBreakdown[];
    team_stats: TeamStats;
    total_requests: number;
    total_days_requested: number;
}

export interface MonthlySummaryResponse {
    success: boolean;
    data: MonthlySummaryData;
}

// Form data types
export interface LeaveRequestForm {
    leave_type: "vacation" | "sick" | "personal" | "";
    start_date: string;
    end_date: string;
    reason: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

// Dashboard data types
export interface DashboardData {
    leaveBalances: LeaveBalance[];
    recentRequests: LeaveRequest[];
    pendingRequests?: LeaveRequest[];
    onLeaveToday?: number;
}

// Error types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

// Utility types
export type LeaveType = "vacation" | "sick" | "personal";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type UserRole = "employee" | "manager";

// Component prop types
export interface AuthProps {
    auth: {
        user: User | null;
    };
}

export interface DashboardProps extends AuthProps {
    // Additional dashboard-specific props can be added here
}

// API endpoint types
export interface ApiEndpoints {
    // Authentication
    login: string;
    register: string;
    logout: string;

    // Leave management
    applyLeave: string;
    getBalances: string;
    getUserRequests: string;
    getPendingRequests: string;
    getOnLeaveToday: string;
    approveLeave: string;
    getMonthlySummary: string;
}

// Constants
export const API_ENDPOINTS: ApiEndpoints = {
    login: "/login",
    register: "/register",
    logout: "/logout",
    applyLeave: "/api/v1/leave/apply",
    getBalances: "/api/v1/leave/balances",
    getUserRequests: "/api/v1/leave/requests",
    getPendingRequests: "/api/v1/leave/pending",
    getOnLeaveToday: "/api/v1/leave/on-leave-today",
    approveLeave: "/api/v1/leave/approve",
    getMonthlySummary: "/api/v1/leave/summary",
};

// Form validation types
export interface FormValidationError {
    field: string;
    message: string;
}

export interface FormState<T> {
    data: T;
    errors: Record<keyof T, string>;
    isSubmitting: boolean;
    isValid: boolean;
}
