<?php

namespace Database\Seeders;

use App\Models\LeaveBalance;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeaveBalanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = now()->year;
        $users = User::all();

        foreach ($users as $user) {
            // Create leave balances for each user
            $leaveTypes = ['vacation', 'sick', 'personal'];
            $totalDays = ['vacation' => 20, 'sick' => 10, 'personal' => 5];

            foreach ($leaveTypes as $type) {
                LeaveBalance::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'leave_type' => $type,
                        'year' => $currentYear,
                    ],
                    [
                        'total_days' => $totalDays[$type],
                        'used_days' => 0,
                        'remaining_days' => $totalDays[$type],
                    ]
                );
            }
        }
    }
}
