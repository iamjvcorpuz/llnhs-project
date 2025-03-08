<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
// kani para mag routing sa react
// Route::get('/',function() {
//     return view('app');
// });

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "student" => StudentController::getAll()
    ]);
});

Route::get('/admin/dashboard/student', function () {
    return Inertia::render('Admin/Student',['props' => null,]);
});

Route::get('/admin/dashboard/student/new', function () {
    return Inertia::render('Admin/Student/NewStudent',['parents' => ParentsController::getAll()]);
});
Route::get('/admin/dashboard/student/update/{id}', function (String $id) {
    return Inertia::render('Admin/Student/EditStudent',[
        'parents' => ParentsController::getAll(),
        'student' => StudentController::getData($id),
        'guardians' => StudentController::getStudentGuardian($id)
    ]);
});

Route::get('/admin/dashboard/teacher', function () {
    return Inertia::render('Admin/Teacher',['props' => null,]);
});
Route::get('/admin/dashboard/teacher/new', function () {
    return Inertia::render('Admin/Teacher/NewTeacher',['props' => null,]);
});
Route::get('/admin/dashboard/teacher/update/{id}', function (String $id) {
    return Inertia::render('Admin/Teacher/EditTeacher',[
        'teacher' => TeacherController::getData($id),
        'contacts' => TeacherController::getContacts($id)
    ]);
});

Route::get('/admin/dashboard/parents', function () {
    return Inertia::render('Admin/Parents',['props' => null,]);
});

Route::get('/admin/dashboard/parents/new', function () {
    return Inertia::render('Admin/Parents/NewParents',['props' => null,]);
});

Route::get('/admin/dashboard/advisory', function () {
    return Inertia::render('Admin/Advisory',["advisory" => AdvisoryController::getAll()]);
});
Route::get('/admin/dashboard/advisory/new', function () {
    return Inertia::render('Admin/Advisory/NewAdvisory',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll()
    ]);
});

Route::get('/admin/dashboard/users', function () {
    return Inertia::render('Admin/Users',['props' => null,]);
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

Route::get('/qrcode', function () {
    return Inertia::render('QRCode');
});
Route::get('/attendance/kiosk', function () {
    return Inertia::render('AttendanceKioskPage');
});
Route::get('/attendance/mobile', function () {
    return Inertia::render('AttendanceMobilePage');
});

require __DIR__.'/auth.php';
require __DIR__.'/api.php';
