<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Services\LeaveValidationService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LeaveRequestController extends Controller
{
    protected $validationService;

    public function __construct(LeaveValidationService $validationService)
    {
        $this->validationService = $validationService;
    }

    /**
     * Apply for leave request
     *
     * Validates leave request data, checks for overlaps, verifies leave balance,
     * and creates a new leave request for the authenticated user.
     *
     * @param  Request  $request  Contains: leave_type, start_date, end_date, reason
     * @return JsonResponse Success with leave request data or validation errors
     */
    public function apply(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'leave_type' => 'required|in:vacation,sick,personal',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $data = $validator->validated();

        // Calculate days requested
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $daysRequested = $startDate->diffInDays($endDate) + 1;

        // Validate dates and overlaps
        if (! $this->validationService->validateDates($data['start_date'], $data['end_date'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot select past dates',
            ], 422);
        }

        if (! $this->validationService->checkOverlaps($user->id, $data['start_date'], $data['end_date'])) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request overlaps with existing request',
            ], 422);
        }

        // Check leave balance
        if (! $this->validationService->validateLeaveBalance($user->id, $daysRequested, $data['leave_type'])) {
            // Get the actual balance for debugging
            $balance = \App\Models\LeaveBalance::where('user_id', $user->id)
                ->where('leave_type', $data['leave_type'])
                ->where('year', now()->year)
                ->first();

            return response()->json([
                'success' => false,
                'message' => 'Insufficient leave balance. You have '.($balance ? $balance->remaining_days : 0).' days remaining.',
                'debug' => [
                    'user_id' => $user->id,
                    'leave_type' => $data['leave_type'],
                    'days_requested' => $daysRequested,
                    'balance' => $balance ? $balance->toArray() : null,
                ],
            ], 422);
        }

        // Create leave request
        $leaveRequest = LeaveRequest::create([
            'user_id' => $user->id,
            'leave_type' => $data['leave_type'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'days_requested' => $daysRequested,
            'reason' => $data['reason'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Leave request submitted successfully',
            'data' => $leaveRequest->load('user'),
        ], 201);
    }

    /**
     * Get pending requests (Manager)
     */
    public function pending(): JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'manager') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only managers can view pending requests.',
            ], 403);
        }

        $pendingRequests = LeaveRequest::with(['user', 'approver'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pendingRequests,
        ]);
    }

    /**
     * Approve or reject a request (Manager)
     */
    public function approve(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'manager') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only managers can approve requests.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:approve,reject',
            'comments' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $leaveRequest = LeaveRequest::findOrFail($id);

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Request has already been processed',
            ], 422);
        }

        $action = $request->input('action');
        $status = $action === 'approve' ? 'approved' : 'rejected';

        // If approving, check leave balance again
        if ($action === 'approve') {
            if (! $this->validationService->validateLeaveBalance(
                $leaveRequest->user_id,
                $leaveRequest->days_requested,
                $leaveRequest->leave_type
            )) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee has insufficient leave balance',
                ], 422);
            }

            // Update leave balance
            $this->updateLeaveBalance($leaveRequest);
        }

        // Update the request
        $leaveRequest->update([
            'status' => $status,
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Leave request {$status} successfully",
            'data' => $leaveRequest->load(['user', 'approver']),
        ]);
    }

    /**
     * Get user's leave balances
     */
    public function balances(): JsonResponse
    {
        $user = Auth::user();
        $currentYear = now()->year;

        $balances = LeaveBalance::where('user_id', $user->id)
            ->where('year', $currentYear)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $balances,
        ]);
    }

    /**
     * Get user's leave requests
     */
    public function userRequests(): JsonResponse
    {
        $user = Auth::user();

        $requests = LeaveRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    /**
     * Get count of team members on leave today
     */
    public function onLeaveToday(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'manager') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only managers can view team leave status.',
            ], 403);
        }

        $date = $request->input('date', now()->toDateString());

        // Use date comparison that handles both date and datetime formats
        $count = LeaveRequest::where('status', 'approved')
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->count();

        return response()->json([
            'success' => true,
            'count' => $count,
            'date' => $date,
        ]);
    }

    /**
     * Get monthly leave summary
     *
     * Returns a summary of leave requests for the current month including:
     * - Total requests by status
     * - Requests by leave type
     * - Daily breakdown
     * - Team member statistics
     */
    public function monthlySummary(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $month = $request->get('month', Carbon::now()->format('Y-m'));
            $startOfMonth = Carbon::parse($month.'-01')->startOfMonth();
            $endOfMonth = Carbon::parse($month.'-01')->endOfMonth();

            // Get all leave requests for the month
            $leaveRequests = LeaveRequest::whereBetween('start_date', [$startOfMonth, $endOfMonth])
                ->orWhereBetween('end_date', [$startOfMonth, $endOfMonth])
                ->orWhere(function ($query) use ($startOfMonth, $endOfMonth) {
                    $query->where('start_date', '<=', $startOfMonth)
                        ->where('end_date', '>=', $endOfMonth);
                })
                ->with('user')
                ->get();

            // Summary by status
            $statusSummary = $leaveRequests->groupBy('status')->map(function ($requests) {
                return [
                    'count' => $requests->count(),
                    'total_days' => $requests->sum('days_requested'),
                ];
            });

            // Summary by leave type
            $typeSummary = $leaveRequests->groupBy('leave_type')->map(function ($requests) {
                return [
                    'count' => $requests->count(),
                    'total_days' => $requests->sum('days_requested'),
                ];
            });

            // Daily breakdown
            $dailyBreakdown = [];
            $current = $startOfMonth->copy();
            while ($current->lte($endOfMonth)) {
                $date = $current->toDateString();
                $onLeave = $leaveRequests->filter(function ($request) use ($date) {
                    return $request->status === 'approved' &&
                           $request->start_date <= $date &&
                           $request->end_date >= $date;
                });

                $dailyBreakdown[] = [
                    'date' => $date,
                    'day_name' => $current->format('l'),
                    'on_leave_count' => $onLeave->count(),
                    'on_leave_employees' => $onLeave->pluck('user.name')->toArray(),
                ];

                $current->addDay();
            }

            // Team statistics
            $teamStats = [
                'total_employees' => $user->role === 'manager' ?
                    LeaveRequest::whereHas('user', function ($query) {
                        $query->where('role', 'employee');
                    })->distinct('user_id')->count() : 1,
                'employees_with_leave' => $leaveRequests->pluck('user_id')->unique()->count(),
                'most_common_leave_type' => $typeSummary->sortByDesc('count')->keys()->first(),
                'average_days_per_request' => $leaveRequests->avg('days_requested'),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'month' => $month,
                    'status_summary' => $statusSummary,
                    'type_summary' => $typeSummary,
                    'daily_breakdown' => $dailyBreakdown,
                    'team_stats' => $teamStats,
                    'total_requests' => $leaveRequests->count(),
                    'total_days_requested' => $leaveRequests->sum('days_requested'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching monthly summary: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update leave balance when request is approved
     */
    private function updateLeaveBalance(LeaveRequest $leaveRequest): void
    {
        $currentYear = now()->year;

        $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
            ->where('leave_type', $leaveRequest->leave_type)
            ->where('year', $currentYear)
            ->first();

        if ($balance) {
            $balance->update([
                'used_days' => $balance->used_days + $leaveRequest->days_requested,
                'remaining_days' => $balance->total_days - ($balance->used_days + $leaveRequest->days_requested),
            ]);
        }
    }
}
