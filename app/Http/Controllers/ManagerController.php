<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ManagerController extends Controller
{
    /**
     * Display the manager dashboard.
     */
    public function dashboard()
    {
        return Inertia::render('Manager/Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
