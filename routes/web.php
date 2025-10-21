<?php

use App\Http\Controllers\AuthController;
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
    // Dashboard

    // Profile
    Route::get('/profile', function () {
        return Inertia::render('Profile/Settings', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    })->name('profile');

});
