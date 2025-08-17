<?php

use App\Http\Controllers\AdvisoryController;
use App\Http\Controllers\AssignSeatsController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassSubjectTeachingController;
use App\Http\Controllers\ClassTSController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\FinalGradeController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\HolidaysController;
use App\Http\Controllers\MessengerController;
use App\Http\Controllers\ParentsController;
use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\ProgramsCurricularController;
use App\Http\Controllers\SchoolSectionController;
use App\Http\Controllers\SchoolYearGradesController;
use App\Http\Controllers\SMSController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserAccountsController;
use App\Models\Advisory;
use Illuminate\Support\Facades\Route;

use Gumlet\ImageResize; 
use Illuminate\Http\Request;

Route::get('/desktop',[StudentController::class,'index']);
Route::get('/generate/code',[GeneralController::class,'generateCode']);

Route::get('/student',[StudentController::class,'index']);
Route::post('/student',[StudentController::class,'store']); 
Route::post('/student/update',[StudentController::class,'update']);
Route::delete('/student',[StudentController::class,'remove']);
Route::post('/student/scan/qr',[StudentController::class,'getQRcode']);
Route::post('/student/grades',[StudentController::class,'getStudentGrade']);
 
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
Route::post('/parents/update/messenger',[ParentsController::class,'updateMessenger']);
Route::delete('/parents',[ParentsController::class,'remove']);

Route::get('/advisory',[AdvisoryController::class,'getRequiredAllData']);
Route::post('/advisory',[AdvisoryController::class,'store']);
Route::post('/advisory/update',[AdvisoryController::class,'update']);
Route::delete('/advisory',[AdvisoryController::class,'remove']);

Route::post('/user/update/auth',[UserAccountsController::class,'update']);
Route::post('/user/accounts/auth',[UserAccountsController::class,'store']);
Route::get('/user/accounts',[UserAccountsController::class,'index']);
Route::delete('/user/accounts',[UserAccountsController::class,'remove']);

Route::post('/attendance/account/find',[AttendanceController::class,'findAccount']);
Route::post('/attendance/time/today/all/timelogs',[AttendanceController::class,'getTodaysTimelogs']);
Route::post('/attendance/time/new/entry',[AttendanceController::class,'insertTimelogs']);
Route::post('/attendance/time/logs',[AttendanceController::class,'getTimelogs']);
Route::post('/attendance/filter/time/logs',[AttendanceController::class,'getFilterTimelogs']);
Route::post('/attendance/filter/time/logs/classroom',[AttendanceController::class,'getFilterClassroomTimelogs']);
Route::post('/attendance/all/time/logs',[AttendanceController::class,'getAllTimelogs']);
// Route::post('/attendance/class/students',[AttendanceController::class,'getClassStudents']);
Route::post('/attendance/class/students',[ClassSubjectTeachingController::class,'getStudentAssignedSeats']);
Route::post('/attendance/time/new/entry/by/class',[AttendanceController::class,'insertTimeTogsByClassV1']);
Route::post('/attendance/time/new/entry/by/event',[AttendanceController::class,'insertTimeTogsByEvent']);
Route::post('/attendance/time/new/entry/by/student',[AttendanceController::class,'insertTimeTogsClassByStudent']);
Route::post('/attendance/time/today/timelogs',[AttendanceController::class,'getTodaysTimelogsClass']);
Route::post('/attendance/time/today/class/timelogs',[AttendanceController::class,'getTodaysTimelogsClass']);


Route::post('/send/emergency/notification',[AttendanceController::class,'insertTimeTogsByEmergency']);

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

Route::post('/classroom/seating/update',[AssignSeatsController::class,'update']);



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

Route::get('/events',[EventsController::class,'getAll']);
Route::post('/events',[EventsController::class,'store']);
Route::post('/events/update',[EventsController::class,'update']);
Route::delete('/events',[EventsController::class,'destroy']);
///teacher/advisory


Route::get('/teacher/advisory/student/{code}',function($code) {
    $id = AuthenticatedSessionController::getAuthId();
    return [
        "students" =>  AdvisoryController::TeachersAllStudentAdvisoriesQR($code), 
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


Route::post('/class/subject/ginal/grade/update',function(Request $request) {
    $id = AuthenticatedSessionController::getAuthId(); 
    if($id!=null) {
       return FinalGradeController::updateGrade($request);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Crazy thing just happened!' ]);
        exit();
    }
});

Route::post('/teacher/class/final/grading/{classid}/{ids}',function($classid,$ids) {
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
       return [
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
       ];
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Crazy thing just happened!' ]);
        exit();
    }
});

Route::post('/teacher/advisory/sf2/{code}',function(Request $request) {
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
       return [
        "sf2_data" =>  AdvisoryController::sf2($id,$request->month,$request->code), 
       ];
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Crazy thing just happened!' ]);
        exit();
    }
});

Route::post('/admin/sf2/{code}',function(Request $request) {
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
       return [
        "sf2_data" =>  AdvisoryController::sf2($id,$request->month,$request->code), 
        "studentsList" =>  AdvisoryController::TeachersAllStudentAdvisoriesQR($request->code), 
       ];
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Crazy thing just happened!' ]);
        exit();
    }
});

Route::post('/admin/school/details/update',function(Request $request) {
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
       return SystemSettingsController::update($request);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Crazy thing just happened!' ]);
        exit();
    }
});

Route::post('/messenger/recepient',[MessengerController::class,'getRecipients']);
// Route::post('/messenger/recepient/sync',[MessengerController::class,'pullMessengerClientData']);
Route::post('/messenger/recepient/sync',function() {
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
       return [MessengerController::pullMessengerClientData()];
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Crazy thing just happened!' ]);
        exit();
    }
});
// Route::post('/messenger/send/message',[MessengerController::class,'sendMessage'])->middleware('auth');
Route::post('/messenger/send/message',[MessengerController::class,'sendMessage']);
// Route::post('/holidays/update',[HolidaysController::class,'update']);
// Route::delete('/holidays',[HolidaysController::class,'destroy']);


Route::get('/profile/photo/{usrtype}/{usrid}',function($usrtype,$usrid){
    $id = AuthenticatedSessionController::getAuthId();
    if($id!=null) {
        $base64_data = ProfilePhotoController::getPhoto($usrtype,$usrid); 
        if($base64_data != "") {
            header ('Content-Type: image/png');
            $base64_data = str_replace("data:image/png;base64,", "",$base64_data);
            $base64_decode = base64_decode($base64_data);
            $base64_size = strlen($base64_decode); 
            $image = ImageResize::createFromString($base64_decode);
            $image->scale(30); 
            header('Content-length: ' . strlen($image->getImageAsString())); 
            echo $image->output(); 
        } else {
            abort(404, 'Opps Sorry!');
        }

    } else {
        abort(404, 'Opps Sorry!');
    }
});