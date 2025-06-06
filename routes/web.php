<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassSubjectTeachingController;
use App\Http\Controllers\ClassTSController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\HolidaysController;
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

Route::get('/admin/qrcodes/view', function () {
    return Inertia::render('QRCodeList',[
        "student" => StudentController::getDataQR(),
        "teacher" => EmployeeController::getAllTeacher(),
        "employee" => EmployeeController::getAllNONETeacher()
    ]);
});

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
        "teacher" => EmployeeController::getAllTeacher(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        "class" => ClassTSController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
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

Route::get('/admin/dashboard/class', function () {
    return Inertia::render('Admin/ClassTS',[
        "class" => ClassTSController::getAll(),
        "classroom" => ClassroomController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/class/rooms', function () {
    return Inertia::render('Admin/ClassRooms',[ 
        "classroom" => ClassroomController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');



Route::get('/admin/dashboard/class/subject/teacher', function () {
    return Inertia::render('Admin/ClassSubjectTeacher',[ 
        "teacher" => EmployeeController::getAllTeacher(),
        "class" => ClassTSController::getAll(),
        "classroom" => ClassroomController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/events', function () {
    return Inertia::render('Admin/Event',[ 
        "events" => EventsController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/holidays', function () {
    return Inertia::render('Admin/Holidays',[ 
        "holidays" => HolidaysController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin/dashboard/messenger', function () {
    return Inertia::render('Admin/Messenger',[ 
        "holidays" => HolidaysController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
// ======================================== teacher ================================
Route::get('/teacher/dashboard', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/Dashboard',[
        "teacher" => [],
        "advisory" => AdvisoryController::TeachersAllAdvisories($id),
        "subjects" => SubjectController::getAll(),
        "sections" => AdvisoryController::TeachersAllAdvisories($id),
        "student" => AdvisoryController::TeachersAdvisoriesStudentsList($id),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/teacher/dashboard/student', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/Student',[
        'studentsList' =>  AdvisoryController::TeachersAdvisoriesStudentsList($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/teacher/dashboard/advisory', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/Advisory',[
        "teacher" =>  EmployeeController::getData($id),
        "advisory" => AdvisoryController::TeachersAllAdvisories($id),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/teacher/advisory/students/{code}', function ($code) {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/StudentAdvisoryList',[
        "code" => $code,
        "students" =>  AdvisoryController::TeachersAllStudentAdvisories($id), 
        "studentsList" =>  StudentController::getAllNonAdvisory($id), 
        "advisory" =>  AdvisoryController::TeachersAdvisories($id,$code), 
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
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

Route::get('/teacher/my/attendance', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('AttendanceMobilePage',[
        "class_teaching" => ClassSubjectTeachingController::getAllTeacherClassTeaching($id),
        "events" => []
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/teacher/attendance/scan', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('AttendanceMobilePage',[
        "class_teaching" => ClassSubjectTeachingController::getAllTeacherClassTeaching($id),
        "events" => []
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/teacher/attendance/student', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/AttendancePage',[
        "class_teaching" => ClassSubjectTeachingController::getAllTeacherClassTeaching($id),
        "events" => []
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/teacher/class/subject', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/ClassSubjectTeacher',[ 
        "class_teaching" => ClassSubjectTeachingController::getAllTeacherClass($id),
        "teacher" => EmployeeController::getAllTeacher(),
        "class" => ClassTSController::getAll(),
        "classroom" => ClassroomController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
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
    return Inertia::render('Parents/Bulletin',[
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/parents/student', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Parents/Student',[
        "data" => ParentsController::getAllMyChildren($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/parents/attendance', function () {
    return Inertia::render('Parents/Attendance',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/parents/profile', function () {
    return Inertia::render('Parents/Profile',[
        "teacher" => []
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
// ======================================== parents ================================

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// ======================================== Student ================================
Route::get('/student/profiles', function () {
    $id = AuthenticatedSessionController::getAuthId();
    // echo "<pre>";
    // print_r($id);
    // echo "</pre>";
    return Inertia::render('Student/MyProfile',[ 
        'parents' => ParentsController::getAll(),
        'student' => StudentController::getData($id),
        'guardians' => StudentController::getStudentGuardian($id),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(), 
        "todayAttendance" => AttendanceController::_getTodaysTimelogs(),
        "getSchoolStats" => StudentController::getSchoolStats($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/student/dashboard', function () {
    return Inertia::render('Student/Dashboard',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/student/dashboard/attendance', function () {
    return Inertia::render('Student/Attendance',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/student/grades', function () {
    return Inertia::render('Student/Grades',['props' => null,]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/student/attendance', function () {
    return Inertia::render('Student/Attendance',[
        'holidays' => HolidaysController::getAll()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/student/myid', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/MyID',[
        "data" => StudentController::getDataID($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/student/qrcode', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/MyQR',[
        "data" => StudentController::getDataID($id)
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// ======================================== Student ================================

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

Route::get('/sf2', function () {
    return Inertia::render('SF2');
});

require __DIR__.'/auth.php';
require __DIR__.'/api.php';
require __DIR__.'/fb.php';
