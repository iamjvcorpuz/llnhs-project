<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\AssignSeatsController;
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
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserAccountsController;
use App\Models\SchoolYearGrades;
use App\Models\UserAccounts;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;
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
})->middleware(['auth', 'verified']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified']);

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
})->middleware(['auth', 'verified']);

Route::get('/admin/school/details', function () {
    return Inertia::render('Admin/SchoolRegistry',[
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
})->middleware(['auth', 'verified']);


Route::get('/admin/attendance', function () {
    return Inertia::render('Admin/Attendance',[
        "employee" => EmployeeController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "student" => StudentController::getAll(),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs()
    ]);
})->middleware(['auth', 'verified']);


Route::get('/admin/attendance/print/{type}/{id}/{month}', function ($type,$id,$month) {
    $user = "";
    if($type=="employee") {
        $user = TeacherController::getDataQR($id);
    } else if($type=="student") {
        $user = StudentController::getDataQRfilter($id);
    }

    return Inertia::render('Admin/EmployeeAttendancePrint',[
        'type' => $type,
        'id' => $id,
        'month' => $month,
        'user' => $user,
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
})->middleware(['auth', 'verified']);



Route::get('/admin/attendance/{type}/{code}/{date}', function ($type,$code,$date,Request $request) {
    $request->merge(['type' => $type,'qrcode' => $code,'date' => $date]);
    return Inertia::render('Admin/Attendance',[
        'result' => AttendanceController::getFilterTimelogs_($request),
        "employee" => EmployeeController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "student" => StudentController::getAll(),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/student', function () {
    return Inertia::render('Admin/Student',['props' => null,]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/student/new', function () {
    return Inertia::render('Admin/Student/NewStudent',[
        'parents' => ParentsController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/student/print/{id}', function ($id) {
    return Inertia::render('Admin/Student/PrintStudent',[
        'parents' => ParentsController::getAll(),
        'student' => StudentController::getData($id),
        'guardians' => StudentController::getStudentGuardian($id),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/student/update/{id}', function (String $id) {
    return Inertia::render('Admin/Student/EditStudent',[
        'parents' => ParentsController::getAll(),
        'student' => StudentController::getData($id),
        'guardians' => StudentController::getStudentGuardian($id),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/teacher', function () {
    return Inertia::render('Admin/Teacher',['props' => null,]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/teacher/new', function () {
    return Inertia::render('Admin/Teacher/NewTeacher',['props' => null,]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/teacher/update/{id}', function (String $id) {
    return Inertia::render('Admin/Teacher/EditTeacher',[
        'teacher' => TeacherController::getData($id),
        'contacts' => TeacherController::getContacts($id)
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/employee/attendance', function () {
    return Inertia::render('EmployeeAttendance',['props' => null,]);
})->middleware(['auth', 'verified']);

// ----------------------------------------------------------------------------------
Route::get('/admin/dashboard/employee', function () {
    return Inertia::render('Admin/Employee',['props' => null,]);
})->middleware(['auth', 'verified']);
Route::get('/admin/dashboard/employee/new', function () {
    return Inertia::render('Admin/Employee/NewEmployee',['props' => null,]);
})->middleware(['auth', 'verified']);
Route::get('/admin/dashboard/employee/update/{id}', function (String $id) {
    return Inertia::render('Admin/Employee/EditEmployee',[
        'employee' => EmployeeController::getData($id),
        'contacts' => EmployeeController::getContacts($id)
    ]);
})->middleware(['auth', 'verified']);
// ----------------------------------------------------------------------------------

Route::get('/admin/dashboard/parents', function () {
    return Inertia::render('Admin/Parents',['props' => null,]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/parents/new', function () {
    return Inertia::render('Admin/Parents/NewParents',['id' => ParentsController::newId()]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/parents/update/{id}', function ($id) {
    return Inertia::render('Admin/Parents/EditParents',[
        'parents' => ParentsController::getData($id),
        'contacts' => ParentsController::getContacts($id)
    ]);
})->middleware(['auth', 'verified']);

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
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/advisory/schedules', function () {
    return Inertia::render('Admin/AdvisoryList',[
        "teacher" => EmployeeController::getAllTeacher(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        "class" => ClassTSController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/advisory/new', function () {
    return Inertia::render('Admin/Advisory/NewAdvisory',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll()
    ]);
})->middleware(['auth', 'verified']);


Route::get('/admin/class/advisory/schedules/details/{id}/{code}', function ($id,$code) {
    return Inertia::render('Admin/AdvisorySchedules',[
        "schedules" => ClassTSController::getAllSchedules($id),
        "students" =>  AdvisoryController::TeachersAllStudentAdvisoriesQR($code), 
        "classDetails" => ClassTSController::getClassDetails($id),
        "classroom" => ClassroomController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/class/advisory/details/{id}/{code}', function ($id,$code) {
    return Inertia::render('Admin/AdvisoryDetails',[
        "schedules" => ClassTSController::getAllSchedules($id),
        "students" =>  AdvisoryController::TeachersAllStudentAdvisoriesQR($code), 
        "classDetails" => ClassTSController::getClassDetails($id),
        "classroom" => ClassroomController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/users', function () {
    return Inertia::render('Admin/Users',[
        'user_list' => UserAccountsController::getAll(),
        'data' => UserAccountsController::getAllUsers()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/users/ids', function () {

    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
        return Inertia::render('Admin/IDS',[
            'user_list' => UserAccountsController::getAll(),
            'data' => UserAccountsController::getAllUsers()
        ]);
    } else {
        abort(404, 'Opps Sorry!');
    }
})->middleware(['auth', 'verified']);

Route::get('/admin/student/print/ids', function () {
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
        return Inertia::render('Admin/PrintIDs',[ 
            'data' => StudentController::getStudentDataID()
        ]);
    } else {
        abort(404, 'Opps Sorry!');
    }
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/settings', function () {
    return Inertia::render('Admin/Users',[
        'user_list' => UserAccountsController::getAll(),
        'data' => UserAccountsController::getAllUsers()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/programs/curricular', function () {
    return Inertia::render('Admin/ProgramsCurricular',[
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/school/subjects', function () {
    return Inertia::render('Admin/Subject',[
        'subjects' => SubjectController::getAll()
    ]);
})->middleware(['auth', 'verified']);

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
})->middleware(['auth', 'verified']);

Route::get('/admin/class/schedule/{id}', function ($id) {
    return Inertia::render('Admin/ClassSchedule',[
        "schedules" => ClassTSController::getAllSchedules($id),
        "classDetails" => ClassTSController::getClassDetails($id),
        "classroom" => ClassroomController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/class/rooms', function () {
    return Inertia::render('Admin/ClassRooms',[ 
        "classroom" => ClassroomController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified']);



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
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/events', function () {
    return Inertia::render('Admin/Event',[ 
        "events" => EventsController::getAll()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/holidays', function () {
    return Inertia::render('Admin/Holidays',[ 
        "holidays" => HolidaysController::getAll()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/dashboard/messenger', function () {
    return Inertia::render('Admin/Messenger',[ 
        "holidays" => HolidaysController::getAll()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/admin/report/sf2', function () {
    $code = "";
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Admin/SF2',[
        "code" => $code,
        "students" =>  AdvisoryController::TeachersAllStudentAdvisoriesQR($code), 
        "studentsList" =>  StudentController::getAllNonAdvisory($id),   
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand(),
        "employee" => EmployeeController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "student" => StudentController::getAll(),
        "todayAttendance" => AttendanceController::_getTodaysTimelogs(),
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
    // "teacher" =>  EmployeeController::getData($id),
    // "advisory" => AdvisoryController::TeachersAllAdvisories($id),
    // "subjects" => SubjectController::getAll(),
    // "sections" => SchoolSectionController::getAll(),
    // "schoolyeargrades" => SchoolYearGradesController::getAll()
})->middleware(['auth', 'verified']);

Route::get('/admin/report/sf4', function () {
    $code = "";
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Admin/SF4',[
        "advisory" => AdvisoryController::getAll(), 
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
    // "teacher" =>  EmployeeController::getData($id),
    // "advisory" => AdvisoryController::TeachersAllAdvisories($id),
    // "subjects" => SubjectController::getAll(),
    // "sections" => SchoolSectionController::getAll(),
    // "schoolyeargrades" => SchoolYearGradesController::getAll()
})->middleware(['auth', 'verified']);


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
})->middleware(['auth', 'verified']);


Route::get('/teacher/dashboard/student', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/Student',[
        'studentsList' =>  AdvisoryController::TeachersAdvisoriesStudentsList($id)
    ]);
})->middleware(['auth', 'verified']);


Route::get('/teacher/dashboard/advisory', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/Advisory',[
        "teacher" =>  EmployeeController::getData($id),
        "advisory" => AdvisoryController::TeachersAllAdvisories($id),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/teacher/advisory/students/{code}', function ($code) {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/StudentAdvisoryList',[
        "code" => $code,
        "students" =>  AdvisoryController::TeachersAllStudentAdvisories($code), 
        "studentsList" =>  StudentController::getAllNonAdvisory($id), 
        "advisory" =>  AdvisoryController::TeachersAdvisories($id,$code), 
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand(),
        'school' => SystemSettingsController::getSchoolRegistration()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/teacher/advisory/sf2/{code}', function ($code) {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/SF2',[
        "code" => $code,
        "students" =>  AdvisoryController::TeachersAllStudentAdvisoriesQR($code), 
        "studentsList" =>  StudentController::getAllNonAdvisory($id), 
        "advisory" =>  AdvisoryController::TeachersAdvisories($id,$code), 
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand(),
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/teacher/dashboard/settings', function () {
    return Inertia::render('Teacher/Settings',[
        "teacher" => TeacherController::getAll(),
        "advisory" => AdvisoryController::getAll(),
        "subjects" => SubjectController::getAll(),
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/teacher/my/attendance', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/Attendance',[
        "timelogs" => AttendanceController::myTimelogs('employee',$id)
    ]);
})->middleware(['auth', 'verified']);
Route::get('/teacher/attendance/scan', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('AttendanceMobilePage',[
        "class_teaching" => ClassSubjectTeachingController::getAllTeacherClassTeaching($id),
        "events" => EventsController::getAllActive()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/teacher/attendance/student', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/AttendancePage',[
        "class_teaching" => ClassSubjectTeachingController::getAllTeacherClassTeaching($id),
        "events" => EventsController::getAllActive()
    ]);
})->middleware(['auth', 'verified']);

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
})->middleware(['auth', 'verified']);


Route::get('/teacher/class/seat/{classid}/{ids}', function ($classid,$ids) {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/AssignSeats',[ 
        "class_teaching" => ClassSubjectTeachingController::getTeacherClassTeaching($ids),
        "assign_class_seats" => AssignSeatsController::getAssignClassSeatsOthers($classid),
        "assign_class_seats_assigned" => AssignSeatsController::getAssignClassSeatAssignedOthers($classid),
        "assign_class_teaching" => AssignSeatsController::getAssignClassSeats($ids),
        "assign_students" => AssignSeatsController::getStudentAssignedSeats($ids),
        "students" => AssignSeatsController::getTeachersAllStudentClass($classid),
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
})->middleware(['auth', 'verified']);

Route::get('/teacher/class/final/grading/{classid}/{ids}', function ($classid,$ids) {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/FinalGrade',[ 
        "class_teaching" => ClassSubjectTeachingController::getTeacherClassTeaching($ids),
        "assign_class_seats" => AssignSeatsController::getAssignClassSeatsOthers($classid),
        "assign_class_seats_assigned" => AssignSeatsController::getAssignClassSeatAssignedOthers($classid),
        "assign_class_teaching" => AssignSeatsController::getAssignClassSeats($ids),
        "assign_students" => AssignSeatsController::getStudentAssignedSeats($ids),
        "students" => AssignSeatsController::getStudentGrades($classid),
        "teacher" => EmployeeController::getAllTeacher(),
        "class" => ClassTSController::getAll(),
        "classroom" => ClassroomController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
    ]);
})->middleware(['auth', 'verified']);


Route::get('/teacher/advisory/final/grading/{code}', function ($code) {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Teacher/AdvisoryFinalGrade',[
        "code" => $code,
        "students" =>  AdvisoryController::TeachersAllStudentAdvisories($code), 
        "studentsList" =>  StudentController::getAllNonAdvisory($id), 
        "advisory" =>  AdvisoryController::TeachersAdvisories($id,$code), 
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/profile/dashboard', function () {
    return Inertia::render('Profile/Default',[
        "teacher" => []
    ]);
})->middleware(['auth', 'verified']);

Route::get('/teacher/events', function () {
    return Inertia::render('Teacher/Event',[ 
        "events" => EventsController::getAllActive()
    ]);
})->middleware(['auth', 'verified']);
// ======================================== teacher ================================
// ======================================== parents ================================
Route::get('/parents/dashboard', function () {
    return Inertia::render('Parents/Bulletin',[
    ]);
})->middleware(['auth', 'verified']);

Route::get('/parents/student', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Parents/Student',[
        "data" => ParentsController::getAllMyChildren($id)
    ]);
})->middleware(['auth', 'verified']);

Route::get('/parents/attendance', function () {
    return Inertia::render('Parents/Attendance',['props' => null,]);
})->middleware(['auth', 'verified']);

Route::get('/parents/profile', function () {
    return Inertia::render('Parents/Profile',[
        "teacher" => []
    ]);
})->middleware(['auth', 'verified']);
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
})->middleware(['auth', 'verified']);

Route::get('/student/dashboard', function () {
    return Inertia::render('Student/Dashboard',['props' => null,]);
})->middleware(['auth', 'verified']);

Route::get('/student/dashboard/attendance', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/Attendance',[
        "timelogs" => AttendanceController::myTimelogs('student',$id)
    ]);
})->middleware(['auth', 'verified']);

Route::get('/student/grades', function (Request $request) {
    $id = AuthenticatedSessionController::getAuthId(); 
    $request->merge(['id' => $id]);
    return Inertia::render('Student/Grades',[
        "mygrades" => StudentController::getStudentGrade($request),
        'sy' => SystemSettingsController::getCurrentSY()
    ]);
})->middleware(['auth', 'verified']);

Route::get('/student/attendance', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/Attendance',[
        "timelogs" => AttendanceController::myTimelogs('student',$id)
    ]);
})->middleware(['auth', 'verified']);

Route::get('/student/scan', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/Scan',[
        "timelogs" => AttendanceController::myTimelogs('student',$id)
    ]);
})->middleware(['auth', 'verified']);

Route::get('/student/myid', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/MyID',[
        "data" => StudentController::getDataID($id)
    ]);
})->middleware(['auth', 'verified']);

Route::get('/student/qrcode', function () {
    $id = AuthenticatedSessionController::getAuthId();
    return Inertia::render('Student/MyQR',[
        "data" => StudentController::getDataID($id)
    ]);
})->middleware(['auth', 'verified']);

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

Route::get('/student/verifier/qr/scan', function () {
    return Inertia::render('QRCodeScannStudent',[
        
    ]);
})->middleware(['auth', 'verified']);

Route::get('/student/verifier/{_id}', function ($_id) {
    // http://localhost:8000/student/verifier/eyJpdiI6InZWdkx3eCtzTDFRVmMxSDkvZXI1ZUE9PSIsInZhbHVlIjoiNEdrWUlvTnFmZDBSaHhkaG1rc1RmUT09IiwibWFjIjoiZGU5MjAxZGNiMmYwOGY1MGI4NjJiMzhiNmU0MmIxMmJiNjQ2MzdjNmY3OTI4Y2NhNTU5ZmQyMTJhMGNmYmI0YyIsInRhZyI6IiJ9
    $id = "";
    try {
        $id = Crypt::decryptString($_id);
    } catch (DecryptException $e) {
        // ...
    }
    return Inertia::render('StudentVerifier',[
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
})->middleware(['auth', 'verified']);

Route::get('/sf2', function () {
    return Inertia::render('SF2');
});

Route::get('/sf4', function () {
    return Inertia::render('SF4',[
        "advisory" => AdvisoryController::getAll(),
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
});

Route::get('/student/pdf', function () {
    return Inertia::render('SF4',[
        "advisory" => AdvisoryController::getAll(),
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
});

Route::get('/lesf', function () {
    return Inertia::render('LESF',[
        "advisory" => AdvisoryController::getAll(),
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
});

Route::get('/beef', function () {
    return Inertia::render('BEEF',[
        "advisory" => AdvisoryController::getAll(),
        'sy' => SystemSettingsController::getCurrentSY(),
        'schoolRegistry' => SystemSettingsController::getSchoolRegistration()
    ]);
});

Route::get('/student/{id}/print/grade', function ($id,Request $request) {
    $request->merge(['id' => $id]);
    return Inertia::render('PrintGrade',[
        "grades" => StudentController::getStudentGrade($request),
        "data" => StudentController::getDataID($id)
    ]);
});

Route::get('/employeeattendance', function () {
    return Inertia::render('EmployeeAttendance',['props' => null,]);
})->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';
require __DIR__.'/api.php';
require __DIR__.'/fb.php';
