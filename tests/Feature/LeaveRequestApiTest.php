<?php

namespace Tests\Feature;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaveRequestApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $employee;

    protected User $manager;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->employee = User::factory()->create([
            'name' => 'Test Employee',
            'email' => 'employee@example.com',
            'role' => 'employee',
        ]);

        $this->manager = User::factory()->create([
            'name' => 'Test Manager',
            'email' => 'manager@example.com',
            'role' => 'manager',
        ]);

        // Create leave balances for employee
        $currentYear = now()->year;
        LeaveBalance::create([
            'user_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 5,
            'remaining_days' => 15,
            'year' => $currentYear,
        ]);

        LeaveBalance::create([
            'user_id' => $this->employee->id,
            'leave_type' => 'sick',
            'total_days' => 10,
            'used_days' => 2,
            'remaining_days' => 8,
            'year' => $currentYear,
        ]);
    }

    /**
     * Test successful leave request submission
     */
    public function test_employee_can_submit_leave_request(): void
    {
        $this->actingAs($this->employee);

        $response = $this->postJson('/api/v1/leave/apply', [
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'reason' => 'Family vacation',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Leave request submitted successfully',
            ]);

        $this->assertDatabaseHas('leave_requests', [
            'user_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'status' => 'pending',
            'reason' => 'Family vacation',
        ]);
    }

    /**
     * Test leave request with past dates is rejected
     */
    public function test_leave_request_with_past_dates_is_rejected(): void
    {
        $this->actingAs($this->employee);

        $response = $this->postJson('/api/v1/leave/apply', [
            'leave_type' => 'vacation',
            'start_date' => now()->subDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(1)->format('Y-m-d'),
            'reason' => 'Family vacation',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test leave request with insufficient balance is rejected
     */
    public function test_leave_request_with_insufficient_balance_is_rejected(): void
    {
        $this->actingAs($this->employee);

        $response = $this->postJson('/api/v1/leave/apply', [
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(20)->format('Y-m-d'), // 20 days requested
            'reason' => 'Long vacation',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    /**
     * Test manager can view pending requests
     */
    public function test_manager_can_view_pending_requests(): void
    {
        // Create a pending leave request
        LeaveRequest::create([
            'user_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'days_requested' => 3,
            'reason' => 'Family vacation',
            'status' => 'pending',
        ]);

        $this->actingAs($this->manager);

        $response = $this->getJson('/api/v1/leave/pending');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(1, 'data');
    }

    /**
     * Test manager can approve leave request
     */
    public function test_manager_can_approve_leave_request(): void
    {
        // Create a pending leave request
        $leaveRequest = LeaveRequest::create([
            'user_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'days_requested' => 3,
            'reason' => 'Family vacation',
            'status' => 'pending',
        ]);

        $this->actingAs($this->manager);

        $response = $this->postJson("/api/v1/leave/approve/{$leaveRequest->id}", [
            'action' => 'approve',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Leave request approved successfully',
            ]);

        $this->assertDatabaseHas('leave_requests', [
            'id' => $leaveRequest->id,
            'status' => 'approved',
            'approved_by' => $this->manager->id,
        ]);
    }

    /**
     * Test manager can reject leave request
     */
    public function test_manager_can_reject_leave_request(): void
    {
        // Create a pending leave request
        $leaveRequest = LeaveRequest::create([
            'user_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'days_requested' => 3,
            'reason' => 'Family vacation',
            'status' => 'pending',
        ]);

        $this->actingAs($this->manager);

        $response = $this->postJson("/api/v1/leave/approve/{$leaveRequest->id}", [
            'action' => 'reject',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Leave request rejected successfully',
            ]);

        $this->assertDatabaseHas('leave_requests', [
            'id' => $leaveRequest->id,
            'status' => 'rejected',
            'approved_by' => $this->manager->id,
        ]);
    }

    /**
     * Test employee can view their leave balances
     */
    public function test_employee_can_view_leave_balances(): void
    {
        $this->actingAs($this->employee);

        $response = $this->getJson('/api/v1/leave/balances');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(2, 'data');

        // Check vacation balance
        $vacationBalance = collect($response->json('data'))->firstWhere('leave_type', 'vacation');
        $this->assertEquals(20, $vacationBalance['total_days']);
        $this->assertEquals(5, $vacationBalance['used_days']);
        $this->assertEquals(15, $vacationBalance['remaining_days']);
    }

    /**
     * Test employee can view their leave requests
     */
    public function test_employee_can_view_their_leave_requests(): void
    {
        // Create some leave requests
        LeaveRequest::create([
            'user_id' => $this->employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'days_requested' => 3,
            'reason' => 'Family vacation',
            'status' => 'pending',
        ]);

        $this->actingAs($this->employee);

        $response = $this->getJson('/api/v1/leave/requests');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(1, 'data');
    }

    /**
     * Test unauthorized access to manager endpoints
     */
    public function test_employee_cannot_access_manager_endpoints(): void
    {
        $this->actingAs($this->employee);

        $response = $this->getJson('/api/v1/leave/pending');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized. Only managers can view pending requests.',
            ]);
    }

    /**
     * Test unauthenticated access is rejected
     */
    public function test_unauthenticated_access_is_rejected(): void
    {
        $response = $this->postJson('/api/v1/leave/apply', [
            'leave_type' => 'vacation',
            'start_date' => now()->addDays(1)->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
            'reason' => 'Family vacation',
        ]);

        $response->assertStatus(401);
    }
}
