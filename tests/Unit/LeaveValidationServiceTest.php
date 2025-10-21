<?php

namespace Tests\Unit;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\LeaveValidationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveValidationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected LeaveValidationService $service;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new LeaveValidationService;

        // Create a test user
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'employee',
        ]);
    }

    /**
     * Test date validation with valid future dates
     */
    public function test_validate_dates_with_valid_future_dates(): void
    {
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');
        $nextWeek = Carbon::tomorrow()->addDays(7)->format('Y-m-d');

        $result = $this->service->validateDates($tomorrow, $nextWeek);

        $this->assertTrue($result);
    }

    /**
     * Test date validation with past dates
     */
    public function test_validate_dates_with_past_dates(): void
    {
        $yesterday = Carbon::yesterday()->format('Y-m-d');
        $today = Carbon::today()->format('Y-m-d');

        $result = $this->service->validateDates($yesterday, $today);

        $this->assertFalse($result);
    }

    /**
     * Test date validation with today as start date
     */
    public function test_validate_dates_with_today_as_start_date(): void
    {
        $today = Carbon::today()->format('Y-m-d');
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');

        $result = $this->service->validateDates($today, $tomorrow);

        $this->assertTrue($result);
    }

    /**
     * Test date validation with invalid date range (end before start)
     * Note: The current service only validates that dates are not in the past,
     * not that end date is after start date. This test documents current behavior.
     */
    public function test_validate_dates_with_invalid_date_range(): void
    {
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');
        $today = Carbon::today()->format('Y-m-d');

        $result = $this->service->validateDates($tomorrow, $today);

        // The current service only checks if dates are not in the past
        // It doesn't validate that end date is after start date
        $this->assertTrue($result);
    }

    /**
     * Test overlap detection with no existing requests
     */
    public function test_check_overlaps_with_no_existing_requests(): void
    {
        $startDate = Carbon::tomorrow()->format('Y-m-d');
        $endDate = Carbon::tomorrow()->addDays(3)->format('Y-m-d');

        $result = $this->service->checkOverlaps($this->user->id, $startDate, $endDate);

        $this->assertTrue($result);
    }

    /**
     * Test overlap detection with overlapping approved request
     */
    public function test_check_overlaps_with_overlapping_approved_request(): void
    {
        // Create an existing approved leave request
        LeaveRequest::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'start_date' => Carbon::tomorrow()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->addDays(5)->format('Y-m-d'),
            'days_requested' => 6,
            'reason' => 'Family vacation',
            'status' => 'approved',
        ]);

        // Try to create overlapping request
        $startDate = Carbon::tomorrow()->addDays(2)->format('Y-m-d');
        $endDate = Carbon::tomorrow()->addDays(7)->format('Y-m-d');

        $result = $this->service->checkOverlaps($this->user->id, $startDate, $endDate);

        $this->assertFalse($result);
    }

    /**
     * Test overlap detection with rejected request (should not overlap)
     */
    public function test_check_overlaps_with_rejected_request(): void
    {
        // Create a rejected leave request
        LeaveRequest::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'start_date' => Carbon::tomorrow()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->addDays(5)->format('Y-m-d'),
            'days_requested' => 6,
            'reason' => 'Family vacation',
            'status' => 'rejected',
        ]);

        // Try to create overlapping request (should be allowed since previous was rejected)
        $startDate = Carbon::tomorrow()->addDays(2)->format('Y-m-d');
        $endDate = Carbon::tomorrow()->addDays(7)->format('Y-m-d');

        $result = $this->service->checkOverlaps($this->user->id, $startDate, $endDate);

        $this->assertTrue($result);
    }

    /**
     * Test overlap detection with non-overlapping request
     */
    public function test_check_overlaps_with_non_overlapping_request(): void
    {
        // Create an existing approved leave request
        LeaveRequest::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'start_date' => Carbon::tomorrow()->format('Y-m-d'),
            'end_date' => Carbon::tomorrow()->addDays(2)->format('Y-m-d'),
            'days_requested' => 3,
            'reason' => 'Family vacation',
            'status' => 'approved',
        ]);

        // Try to create non-overlapping request
        $startDate = Carbon::tomorrow()->addDays(5)->format('Y-m-d');
        $endDate = Carbon::tomorrow()->addDays(7)->format('Y-m-d');

        $result = $this->service->checkOverlaps($this->user->id, $startDate, $endDate);

        $this->assertTrue($result);
    }

    /**
     * Test leave balance validation with sufficient balance
     */
    public function test_validate_leave_balance_with_sufficient_balance(): void
    {
        // Create leave balance for the user
        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 5,
            'remaining_days' => 15,
            'year' => now()->year,
        ]);

        $result = $this->service->validateLeaveBalance($this->user->id, 10, 'vacation');

        $this->assertTrue($result);
    }

    /**
     * Test leave balance validation with insufficient balance
     */
    public function test_validate_leave_balance_with_insufficient_balance(): void
    {
        // Create leave balance for the user
        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 15,
            'remaining_days' => 5,
            'year' => now()->year,
        ]);

        $result = $this->service->validateLeaveBalance($this->user->id, 10, 'vacation');

        $this->assertFalse($result);
    }

    /**
     * Test leave balance validation with no balance record
     */
    public function test_validate_leave_balance_with_no_balance_record(): void
    {
        $result = $this->service->validateLeaveBalance($this->user->id, 5, 'vacation');

        $this->assertFalse($result);
    }

    /**
     * Test leave balance validation with exact remaining balance
     */
    public function test_validate_leave_balance_with_exact_remaining_balance(): void
    {
        // Create leave balance for the user
        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'sick',
            'total_days' => 10,
            'used_days' => 7,
            'remaining_days' => 3,
            'year' => now()->year,
        ]);

        $result = $this->service->validateLeaveBalance($this->user->id, 3, 'sick');

        $this->assertTrue($result);
    }

    /**
     * Test get leave balance for user
     */
    public function test_get_leave_balance_for_user(): void
    {
        // Create multiple leave balances for the user
        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 5,
            'remaining_days' => 15,
            'year' => now()->year,
        ]);

        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'sick',
            'total_days' => 10,
            'used_days' => 2,
            'remaining_days' => 8,
            'year' => now()->year,
        ]);

        $balances = $this->service->getLeaveBalance($this->user->id);

        $this->assertCount(2, $balances);

        // Find vacation balance (order is not guaranteed)
        $vacationBalance = collect($balances)->firstWhere('leave_type', 'vacation');
        $this->assertNotNull($vacationBalance);
        $this->assertEquals(20, $vacationBalance['total_days']);
        $this->assertEquals(5, $vacationBalance['used_days']);
        $this->assertEquals(15, $vacationBalance['remaining_days']);

        // Find sick balance
        $sickBalance = collect($balances)->firstWhere('leave_type', 'sick');
        $this->assertNotNull($sickBalance);
        $this->assertEquals(10, $sickBalance['total_days']);
        $this->assertEquals(2, $sickBalance['used_days']);
        $this->assertEquals(8, $sickBalance['remaining_days']);
    }

    /**
     * Test get leave balance for user with no balances
     */
    public function test_get_leave_balance_for_user_with_no_balances(): void
    {
        $balances = $this->service->getLeaveBalance($this->user->id);

        $this->assertEmpty($balances);
    }

    /**
     * Test get leave balance for specific year
     */
    public function test_get_leave_balance_for_specific_year(): void
    {
        $currentYear = now()->year;
        $lastYear = $currentYear - 1;

        // Create balance for current year
        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 5,
            'remaining_days' => 15,
            'year' => $currentYear,
        ]);

        // Create balance for last year
        LeaveBalance::create([
            'user_id' => $this->user->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 10,
            'remaining_days' => 10,
            'year' => $lastYear,
        ]);

        $currentYearBalances = $this->service->getLeaveBalance($this->user->id, $currentYear);
        $lastYearBalances = $this->service->getLeaveBalance($this->user->id, $lastYear);

        $this->assertCount(1, $currentYearBalances);
        $this->assertCount(1, $lastYearBalances);
        $this->assertEquals(15, $currentYearBalances[0]['remaining_days']);
        $this->assertEquals(10, $lastYearBalances[0]['remaining_days']);
    }
}
