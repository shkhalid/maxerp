<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display the employee dashboard.
     */
    public function dashboard()
    {
        return Inertia::render('Employee/Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
