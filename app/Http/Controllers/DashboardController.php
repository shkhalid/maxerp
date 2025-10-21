<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard with role-based redirection.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'manager') {
            return redirect()->route('manager.dashboard');
        } else {
            return redirect()->route('employee.dashboard');
        }
    }
}
