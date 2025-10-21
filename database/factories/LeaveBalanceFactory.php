<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveBalance>
 */
class LeaveBalanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalDays = $this->faker->numberBetween(10, 25);
        $usedDays = $this->faker->numberBetween(0, $totalDays);

        return [
            'user_id' => User::factory(),
            'leave_type' => $this->faker->randomElement(['vacation', 'sick', 'personal']),
            'total_days' => $totalDays,
            'used_days' => $usedDays,
            'remaining_days' => $totalDays - $usedDays,
            'year' => now()->year,
        ];
    }
}
