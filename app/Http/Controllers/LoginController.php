<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    //
    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
        ]);
        $remember = $request->remember;

        // print_r($credentials);
        if (Auth::attempt($credentials,$remember)) {
            $request->session()->regenerate();
            // echo "ok";
            // $user = DB::table('user_accounts')
            //     ->where('phone_number', '=', $request->username) 
            //     ->get();
            // echo $request->user()->user_type;
            if($request->user()->user_type == "Admin") {
                return redirect('/admin/dashboard');
            } else if($request->user()->user_type == "Student") {
                return redirect('/student/profiles');
            } else if($request->user()->user_type == "Teacher") {
                return redirect('/teacher/dashboard');
            } else if($request->user()->user_type == "Guardian") {
                return redirect('/parents/dashboard');
            }
            // print_r($request->user());
        }
        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.',
        ])->onlyInput('username');
    }
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
    public function logout() : RedirectResponse
    {
        Auth::guard('web')->logout();
        return redirect('/');
    }
}
