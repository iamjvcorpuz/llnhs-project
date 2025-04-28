<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassSubjectTeachingController;
use App\Http\Controllers\ClassTSController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\HolidaysController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\ProgramsCurricularController;
use App\Http\Controllers\SchoolSectionController;
use App\Http\Controllers\SchoolYearGradesController;
use App\Http\Controllers\SMSController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserAccountsController;
use Illuminate\Support\Facades\Route;

Route::get('/desktop',[StudentController::class,'index']);
Route::get('/generate/code',[GeneralController::class,'generateCode']);

Route::get('/student',[StudentController::class,'index']);
Route::post('/student',[StudentController::class,'store']); 
Route::post('/student/update',[StudentController::class,'update']);
Route::delete('/student',[StudentController::class,'remove']);
 
Route::get('/teacher',[TeacherController::class,'index']);
Route::post('/teacher',[TeacherController::class,'store']);
Route::post('/teacher/update',[TeacherController::class,'update']);
Route::delete('/teacher',[TeacherController::class,'remove']);

Route::get('/employee',[EmployeeController::class,'index']);
Route::post('/employee',[EmployeeController::class,'store']);
Route::post('/employee/update',[EmployeeController::class,'update']);
Route::delete('/employee',[EmployeeController::class,'remove']);

Route::get('/contacts',[ContactsController::class,'index']);
Route::post('/contacts',[ContactsController::class,'store']);

Route::get('/parents',[ParentsController::class,'index']);
Route::post('/parents',[ParentsController::class,'store']);
Route::post('/parents/update',[ParentsController::class,'update']);
Route::delete('/parents',[ParentsController::class,'remove']);

Route::get('/advisory',[AdvisoryController::class,'getRequiredAllData']);
Route::post('/advisory',[AdvisoryController::class,'store']);
Route::delete('/advisory',[AdvisoryController::class,'remove']);

Route::post('/user/update/auth',[UserAccountsController::class,'update']);
Route::post('/user/accounts/auth',[UserAccountsController::class,'store']);
Route::get('/user/accounts',[UserAccountsController::class,'index']);
Route::delete('/user/accounts',[UserAccountsController::class,'remove']);

Route::post('/attendance/account/find',[AttendanceController::class,'findAccount']);
Route::post('/attendance/time/today/all/timelogs',[AttendanceController::class,'getTodaysTimelogs']);
Route::post('/attendance/time/new/entry',[AttendanceController::class,'insertTimelogs']);
Route::post('/attendance/time/logs',[AttendanceController::class,'getTimelogs']);
// Route::post('/attendance/class/students',[AttendanceController::class,'getClassStudents']);
Route::post('/attendance/class/students',[AdvisoryController::class,'TeachersAllStudentClass']);
Route::post('/attendance/time/new/entry/by/class',[AttendanceController::class,'insertTimeTogsByClass']);
Route::post('/attendance/time/today/timelogs',[AttendanceController::class,'getTodaysTimelogsClass']);
// Route::post('/attendance/class/students',function($id) { 
//     return AdvisoryController::TeachersAllStudentClass($id);
// });

Route::post('/sms/send/test',[SMSController::class,'testSendSMS']);
Route::post('/sms/send',[SMSController::class,'SendSMS']);
Route::post('/sms/send/attendance',[SMSController::class,'SendSMSAttendance']);
Route::post('/sms/remove/all/outbox',[SMSController::class,'DeleteAllOutboxMSG']);


Route::get('/subject',[SubjectController::class,'getAll']);
Route::post('/subject',[SubjectController::class,'store']);
Route::post('/subject/update',[SubjectController::class,'update']);
Route::delete('/subject',[SubjectController::class,'remove']);


Route::get('/programs/curricular',[ProgramsCurricularController::class,'getAll']);
Route::post('/programs/curricular',[ProgramsCurricularController::class,'store']);
Route::post('/programs/curricular/update',[ProgramsCurricularController::class,'update']);
Route::delete('/programs/curricular',[ProgramsCurricularController::class,'remove']);


Route::get('/classroom',[ClassroomController::class,'getAll']);
Route::post('/classroom',[ClassroomController::class,'store']);
Route::post('/classroom/update',[ClassroomController::class,'update']);
Route::delete('/classroom',[ClassroomController::class,'remove']);


Route::get('/tsclass',[ClassTSController::class,'getAll2']);
Route::post('/tsclass',[ClassTSController::class,'store']);
Route::post('/tsclass/update',[ClassTSController::class,'update']);
Route::delete('/tsclass',[ClassTSController::class,'destroy']);


Route::get('/class/subject/teacher',[ClassSubjectTeachingController::class,'getAll2']);
Route::post('/class/subject/teacher',[ClassSubjectTeachingController::class,'store']);
Route::post('/class/subject/teacher/update',[ClassSubjectTeachingController::class,'update']);
Route::delete('/class/subject/teacher',[ClassSubjectTeachingController::class,'destroy']);


Route::get('/holidays',[HolidaysController::class,'getAll']);
Route::post('/holidays',[HolidaysController::class,'store']);
Route::post('/holidays/update',[HolidaysController::class,'update']);
Route::delete('/holidays',[HolidaysController::class,'destroy']);

///teacher/advisory


Route::get('/teacher/advisory/student/{code}',function($code) {
    $id = AuthenticatedSessionController::getAuthId();
    return [
        "students" =>  AdvisoryController::TeachersAllStudentAdvisories($id), 
        "studentsList" =>  StudentController::getAllNonAdvisory($id), 
        "advisory" =>  AdvisoryController::TeachersAdvisories($id,$code), 
        "sections" => SchoolSectionController::getAll(),
        "schoolyeargrades" => SchoolYearGradesController::getAll(),
        'track' => ProgramsCurricularController::getTrack(),
        'strand' => ProgramsCurricularController::getStrand()
    ];
});
Route::post('/teacher/advisory/student/add',[AdvisoryController::class,'addStudentAdvisory']);
Route::delete('/teacher/advisory/student',[AdvisoryController::class,'removeStudentAdvisory']); 
Route::get('/teacher/class/subjects',function() {
    $id = AuthenticatedSessionController::getAuthId();
    return ClassSubjectTeachingController::getAllTeacherClass($id);
});
// Route::post('/holidays/update',[HolidaysController::class,'update']);
// Route::delete('/holidays',[HolidaysController::class,'destroy']);