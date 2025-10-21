<?php

namespace Tests\Feature;

use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MonthlySummaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_can_get_monthly_summary()
    {
        // Create test user
        $user = User::factory()->create(['role' => 'employee']);

        // Create leave balance
        LeaveBalance::factory()->create([
            'user_id' => $user->id,
            'leave_type' => 'vacation',
            'total_days' => 20,
            'used_days' => 5,
            'remaining_days' => 15,
        ]);

        // Create some leave requests
        LeaveRequest::factory()->create([
            'user_id' => $user->id,
            'leave_type' => 'vacation',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addDays(2)->format('Y-m-d'),
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/leave/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'month',
                    'status_summary',
                    'type_summary',
                    'daily_breakdown',
                    'team_stats',
                    'total_requests',
                    'total_days_requested',
                ],
            ]);
    }

    public function test_manager_can_get_monthly_summary()
    {
        // Create manager user
        $manager = User::factory()->create(['role' => 'manager']);

        // Create employee user
        $employee = User::factory()->create(['role' => 'employee']);

        // Create leave requests for employee
        LeaveRequest::factory()->create([
            'user_id' => $employee->id,
            'leave_type' => 'vacation',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addDays(1)->format('Y-m-d'),
            'status' => 'approved',
        ]);

        $response = $this->actingAs($manager)
            ->getJson('/api/v1/leave/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'month',
                    'status_summary',
                    'type_summary',
                    'daily_breakdown',
                    'team_stats',
                    'total_requests',
                    'total_days_requested',
                ],
            ]);
    }

    public function test_monthly_summary_with_specific_month()
    {
        $user = User::factory()->create(['role' => 'employee']);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/leave/summary?month=2025-01');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'month' => '2025-01',
                ],
            ]);
    }
}
