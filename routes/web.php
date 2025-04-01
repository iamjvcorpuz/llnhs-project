<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramsCurricularController;
use App\Http\Controllers\SchoolSectionController;
use App\Http\Controllers\SchoolYearGradesController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserAccountsController;
use App\Models\SchoolYearGrades;
use App\Models\UserAccounts;
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
    return Inertia::render('Dashboard', [
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
        "teacher" => EmployeeController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "student" => StudentController::getAll(),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/student', function () {
    return Inertia::render('Admin/Student',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/student/new', function () {
    return Inertia::render('Admin/Student/NewStudent',[
        'parents' => ParentsController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/admin/dashboard/student/update/{id}', function (String $id) {
    return Inertia::render('Admin/Student/EditStudent',[
        'parents' => ParentsController::getAll(),
        'student' => StudentController::getData($id),
        'guardians' => StudentController::getStudentGuardian($id),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/teacher', function () {
    return Inertia::render('Admin/Teacher',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/admin/dashboard/teacher/new', function () {
    return Inertia::render('Admin/Teacher/NewTeacher',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/admin/dashboard/teacher/update/{id}', function (String $id) {
    return Inertia::render('Admin/Teacher/EditTeacher',[
        'teacher' => TeacherController::getData($id),
        'contacts' => TeacherController::getContacts($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// ----------------------------------------------------------------------------------
Route::get('/admin/dashboard/employee', function () {
    return Inertia::render('Admin/Employee',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/admin/dashboard/employee/new', function () {
    return Inertia::render('Admin/Employee/NewEmployee',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/admin/dashboard/employee/update/{id}', function (String $id) {
    return Inertia::render('Admin/Employee/EditEmployee',[
        'employee' => EmployeeController::getData($id),
        'contacts' => EmployeeController::getContacts($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
// ----------------------------------------------------------------------------------

Route::get('/admin/dashboard/parents', function () {
    return Inertia::render('Admin/Parents',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/parents/new', function () {
    return Inertia::render('Admin/Parents/NewParents',['id' => ParentsController::newId()]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/parents/update/{id}', function ($id) {
    return Inertia::render('Admin/Parents/EditParents',[
        'parents' => ParentsController::getData($id),
        'contacts' => ParentsController::getContacts($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/advisory', function () {
    return Inertia::render('Admin/Advisory',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/advisory/new', function () {
    return Inertia::render('Admin/Advisory/NewAdvisory',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/users', function () {
    return Inertia::render('Admin/Users',[
        'user_list' => UserAccountsController::getAll(),
        'data' => UserAccountsController::getAllUsers()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/settings', function () {
    return Inertia::render('Admin/Users',[
        'user_list' => UserAccountsController::getAll(),
        'data' => UserAccountsController::getAllUsers()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/programs/curricular', function () {
    return Inertia::render('Admin/ProgramsCurricular',[
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/school/subjects', function () {
    return Inertia::render('Admin/Subject',[
        'subjects' => SubjectController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// ======================================== teacher ================================
Route::get('/teacher/dashboard', function () {
    return Inertia::render('Teacher/Dashboard',[
        "teacher" => [],
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "student" => StudentController::getAll(),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/teacher/dashboard/student', function () {
    return Inertia::render('Teacher/Student',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/teacher/dashboard/advisory', function () {
    return Inertia::render('Teacher/Advisory',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/teacher/dashboard/settings', function () {
    return Inertia::render('Teacher/Settings',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/profile/dashboard', function () {
    return Inertia::render('Profile/Default',[
        "teacher" => []
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// ======================================== teacher ================================
// ======================================== parents ================================
Route::get('/parents/dashboard', function () {
    return Inertia::render('Parents/Dashboard',[
        "teacher" => [],
        "advisory" => [],
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "student" => StudentController::getAll(),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/parents/dashboard/student', function () {
    return Inertia::render('Parents/Student',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/parents/dashboard/attendance', function () {
    return Inertia::render('Parents/Attendance',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');
// ======================================== parents ================================

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

Route::get('/student/{id}/print/id', function (String $id) {
    return Inertia::render('PrintID',[
        "data" => StudentController::getDataID($id)
    ]);
});

Route::get('/loading', function () {
    return Inertia::render('Loading');
});

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
