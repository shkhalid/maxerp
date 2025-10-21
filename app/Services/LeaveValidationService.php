<?php

namespace App\Services;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use Carbon\Carbon;

class LeaveValidationService
{
    /**
     * Validate that dates are not in the past
     */
    public function validateDates(string $startDate, string $endDate): bool
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $today = Carbon::today();

        return $start->greaterThanOrEqualTo($today) && $end->greaterThanOrEqualTo($today);
    }

    /**
     * Check for overlapping leave requests
     */
    public function checkOverlaps(int $userId, string $startDate, string $endDate): bool
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        $overlappingRequest = LeaveRequest::where('user_id', $userId)
            ->where('status', '!=', 'rejected')
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_date', [$start, $end])
                    ->orWhereBetween('end_date', [$start, $end])
                    ->orWhere(function ($q) use ($start, $end) {
                        $q->where('start_date', '<=', $start)
                            ->where('end_date', '>=', $end);
                    });
            })
            ->exists();

        return ! $overlappingRequest;
    }

    /**
     * Validate leave balance before approval
     */
    public function validateLeaveBalance(int $userId, int $daysRequested, string $leaveType): bool
    {
        $currentYear = now()->year;

        $balance = LeaveBalance::where('user_id', $userId)
            ->where('leave_type', $leaveType)
            ->where('year', $currentYear)
            ->first();

        if (! $balance) {
            return false; // No balance record found
        }

        return $balance->remaining_days >= $daysRequested;
    }

    /**
     * Get leave balance for a user
     */
    public function getLeaveBalance(int $userId, ?int $year = null): array
    {
        $year = $year ?? now()->year;

        $balances = LeaveBalance::where('user_id', $userId)
            ->where('year', $year)
            ->get();

        return $balances->map(function ($balance) {
            return [
                'leave_type' => $balance->leave_type,
                'total_days' => $balance->total_days,
                'used_days' => $balance->used_days,
                'remaining_days' => $balance->remaining_days,
            ];
        })->toArray();
    }
}
