<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test employee
        User::create([
            'name' => 'John Employee',
            'email' => 'employee@company.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'is_active' => true,
        ]);

        // Create test manager
        User::create([
            'name' => 'Jane Manager',
            'email' => 'manager@company.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'is_active' => true,
        ]);

        // Create additional test users
        User::create([
            'name' => 'Mike Developer',
            'email' => 'mike@company.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Sarah Designer',
            'email' => 'sarah@company.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'is_active' => true,
        ]);
    }
}
