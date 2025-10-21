<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user profile settings.
     */
    public function settings()
    {
        return Inertia::render('Profile/Settings', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
