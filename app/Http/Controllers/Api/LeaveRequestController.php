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
     * Apply for leave (Employee)
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
            return response()->json([
                'success' => false,
                'message' => 'Insufficient leave balance',
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
