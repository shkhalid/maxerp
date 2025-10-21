<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Landing', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('home');

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/login', [AuthController::class, 'webLogin'])->name('auth.login');
Route::post('/register', [AuthController::class, 'webRegister'])->name('auth.register');
Route::post('/logout', [AuthController::class, 'webLogout'])->name('auth.logout');

// Protected routes
Route::middleware(['auth'])->group(function () {
    // Dashboard - Role-based routing
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Employee routes
    Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->name('employee.dashboard');

    // Manager routes
    Route::get('/manager/dashboard', [ManagerController::class, 'dashboard'])->name('manager.dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'settings'])->name('profile');

});
