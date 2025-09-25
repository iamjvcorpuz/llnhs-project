<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'version' => env('VERSION',"v0.8.7")
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        if($request->user()->user_type == "Admin") {
            return redirect()->intended('admin/dashboard');
        } else if($request->user()->user_type == "Student") {
            return redirect()->intended('student/profiles');
        } else if($request->user()->user_type == "Teacher") {
            return redirect()->intended('teacher/dashboard');
        } else if($request->user()->user_type == "Guardian") {
            return redirect()->intended('parents/dashboard');
        }
        return redirect()->intended(route('dashboard', absolute: false));
    }
    public static function getAuthId() { 
        // if (isset(Auth::user()->user_id)) {
            return isset(Auth::user()->user_id) ? Auth::user()->user_id: null;
        // } else {
        //     http_response_code(500);
        //     // echo json_encode( [ 'success' => false , 'message' => 'Crazy thing just happened!' ]);
        //     exit();
        // }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
