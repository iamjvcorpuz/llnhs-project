<?php

namespace App\Http\Middleware;

use App\Http\Controllers\ParentsController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $userd = $request->user();
        $profile = [];
        if($userd != null && $userd->user_type == "Admin") {
            
        } else if($userd != null && $userd->user_type == "Teacher") {
            $profile = TeacherController::getData2($userd->user_id);
        } else if($userd != null && $userd->user_type == "Student") {
            $profile = StudentController::getData2($userd->user_id);
        } else if($userd != null && $userd->user_type == "Guardian") {
            $profile = ParentsController::getData($userd->user_id);
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userd,
                'profile' => $profile,
                'varsion' => env('VERSION',"v1.0.9")
            ],
        ];
    }
}
