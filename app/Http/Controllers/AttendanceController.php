<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\Attendance;
use App\Models\Notifications;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Expr\Cast\Object_;
use stdClass;

use function PHPUnit\Framework\isNull;

class AttendanceController extends Controller
{
    //
    public function findAccount(Request $request) {

        $Student = DB::table('student')
        ->where('qr_code', '=', $request->code)
        ->get();
        $Teacher = DB::table('employee')
        ->where('qr_code', '=', $request->code)
        ->get();
        // $Teacher = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,employee_type,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type = \'Teacher\' AND t.qr_code = ?;',[$request->code]);
        
        if($Student->count()>0) { 
            $Student[0]->type = "student"; 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $Student[0]
            ], 200);
        } else if($Teacher->count()>0) { 
            $Teacher[0]->type = "teacher"; 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $Teacher[0]
            ], 200);
        } else {
            return response()->json([
                'status' => 'not_found',
                'error' => null,
                'data' => []
            ], 200);
        }
    }
    public function getClassStudents(Request $request) {

        $Student = DB::table('student')
        ->where('qr_code', '=', $request->code)
        ->get();
        $Teacher = DB::table('employee')
        ->where('qr_code', '=', $request->code)
        ->get();
        // $Teacher = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,employee_type,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type = \'Teacher\' AND t.qr_code = ?;',[$request->code]);
        
        if($Student->count()>0) { 
            $Student[0]->type = "student"; 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $Student[0]
            ], 200);
        } else if($Teacher->count()>0) { 
            $Teacher[0]->type = "teacher"; 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $Teacher[0]
            ], 200);
        } else {
            return response()->json([
                'status' => 'not_found',
                'error' => null,
                'data' => []
            ], 200);
        }
    }
    public function getTodaysTimelogs(Request $request) {
        $token = $request->session()->token();
 
        $token = csrf_token();
        
        $logs = DB::select('SELECT * FROM attendance WHERE  date = ? AND terminal = \'kiosk\' ',[$request->date]);
        $attendance = array();
        foreach($logs as $key => $val) { 
            
            $teacher = is_null($val->teacher_id) ? null: DB::table('employee')->where('id', $val->teacher_id)->where('employee_type', 'Teacher')->get();
            $student = is_null($val->student_id) ? null: DB::table('student')->where('id', $val->student_id)->get();
            $section = "";
            if(is_null($teacher) == false && $teacher->count()>0) {
                $object = new stdClass();
                $object->_id = $teacher[0]->id;
                $object->lrn = $teacher[0]->id;
                $object->profileImageBase64 = $teacher[0]->picture_base64;
                $object->fullname = $teacher[0]->first_name . " " . $teacher[0]->last_name;
                $object->idnumber = $teacher[0]->qr_code;
                $object->logger_type = "teacher";
                $object->logger_section = "";
                $object->timelogs = "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                $object->created_at = $val->created_at;
                array_push($attendance,$object );
            }
            if(is_null($student) == false && $student->count()>0) {
                $object = new stdClass();
                $object->_id = $student[0]->id;
                $object->lrn = $student[0]->lrn;
                $object->profileImageBase64 = $student[0]->id;
                $object->fullname = $student[0]->first_name . " " . $student[0]->last_name;
                $object->idnumber = $student[0]->qr_code;
                $object->logger_type = "studnet";
                $object->logger_section = "";
                $object->timelogs =  "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                $object->created_at = $val->created_at;
                array_push($attendance,$object);
            }
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $attendance
        ], 200);

    }
    public function getTodaysTimelogsClassOld(Request $request) {
        $token = $request->session()->token();
 
        $token = csrf_token();
        
        $logs = DB::select('SELECT * FROM attendance WHERE  date = ? ',[$request->date]);
        $attendance = array();
        foreach($logs as $key => $val) { 
            
            $teacher = is_null($val->teacher_id) ? null: DB::table('employee')->where('id', $val->teacher_id)->where('employee_type', 'Teacher')->get();
            $student = is_null($val->student_id) ? null: DB::table('student')->where('id', $val->student_id)->get();
            $section = "";
            if(is_null($teacher) == false && $teacher->count()>0) {
                $object = new stdClass();
                $object->_id = $teacher[0]->id;
                $object->lrn = $teacher[0]->id;
                $object->profileImageBase64 = $teacher[0]->picture_base64;
                $object->fullname = $teacher[0]->first_name . " " . $teacher[0]->last_name;
                $object->idnumber = $teacher[0]->qr_code;
                $object->logger_type = "teacher";
                $object->logger_section = "";
                $object->timelogs = "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                $object->created_at = $val->created_at;
                array_push($attendance,$object );
            }
            if(is_null($student) == false && $student->count()>0) {
                $object = new stdClass();
                $object->_id = $student[0]->id;
                $object->lrn = $student[0]->lrn;
                $object->profileImageBase64 = $student[0]->id;
                $object->fullname = $student[0]->first_name . " " . $student[0]->last_name;
                $object->idnumber = $student[0]->qr_code;
                $object->logger_type = "studnet";
                $object->logger_section = "";
                $object->timelogs =  "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                $object->created_at = $val->created_at;
                array_push($attendance,$object);
            }
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $attendance
        ], 200);

    }
    public function getTodaysTimelogsClass(Request $request) {        
        $logs = DB::select("SELECT * FROM attendance WHERE terminal = 'Class' AND terminal_id = :terminal_id AND date = :date;",[ "terminal_id" => $request->terminal_id,"date" => $request->date]);
        // $logs = DB::table("attendance")->where('terminal', 'Class')->where('terminal_id', $request->teminal_id)->where('date', $request->date)->get();
        $attendance = array();
        foreach($logs as $key => $val) {
            $student = is_null($val->student_id) ? null: DB::table('student')->where('id', $val->student_id)->get();
            $section = "";
            if(is_null($student) == false && $student->count()>0) {
                $object = new stdClass();
                $object->_id = $student[0]->id;
                $object->lrn = $student[0]->lrn;
                $object->profileImageBase64 = $student[0]->id;
                $object->fullname = $student[0]->first_name . " " . $student[0]->last_name;
                $object->idnumber = $student[0]->qr_code;
                $object->logger_type = "studnet";
                $object->logger_section = "";
                $object->timelogs =  "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                $object->created_at = $val->created_at;
                array_push($attendance,$object);
            }
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $attendance
        ], 200);

    }
    public static function _getTodaysTimelogs() {

        $logs = DB::select('SELECT * FROM attendance WHERE  date = ? ',[date("Y-m-d")]);
        $attendance = array();
        foreach($logs as $key => $val) { 
            
            $teacher = is_null($val->teacher_id) ? null: DB::table('employee')->where('id', $val->teacher_id)->get();
            $student = is_null($val->student_id) ? null: DB::table('student')->where('id', $val->student_id)->get();
            $section = "";
            if(is_null($teacher) == false && $teacher->count()>0) {
                $object = new stdClass();
                $object->_id = $teacher[0]->id;
                $object->lrn = $teacher[0]->id;
                $object->profileImageBase64 = $teacher[0]->picture_base64;
                $object->fullname = $teacher[0]->first_name . " " . $teacher[0]->last_name;
                $object->idnumber = $teacher[0]->qr_code;
                $object->logger_type = "teacher";
                $object->logger_section = "";
                $object->timelogs = "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                array_push($attendance,$object );
            }
            if(is_null($student) == false && $student->count()>0) {
                $object = new stdClass();
                $object->_id = $student[0]->id;
                $object->lrn = $student[0]->lrn;
                $object->profileImageBase64 = $student[0]->id;
                $object->fullname = $student[0]->first_name . " " . $student[0]->last_name;
                $object->idnumber = $student[0]->qr_code;
                $object->logger_type = "studnet";
                $object->logger_section = "";
                $object->timelogs =  "TIME " . $val->mode . ": " . $val->time;
                $object->date = $val->date;
                $object->section = $section;
                $object->mode = $val->mode;
                array_push($attendance,$object);
            }
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $attendance
        ], 200);

    }
    public function getTimelogs(Request $request) {
        $logs = (object)array();

        if($request->type == "student") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$request->date,$request->qrcode]);
        } else if($request->type == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "employee" AND date = ? AND qr_code = ?',[$request->date,$request->qrcode]);
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $logs
        ], 200);

    }
    public static function getTimelogsAnnual() {
        $logs = (object)array();

        $logs = DB::select("SELECT * FROM attendance WHERE type = 'student' AND DATE_FORMAT(`date`, '%Y') = ?",['2025']);

        return  $logs;

    }
    public function getFilterTimelogs(Request $request) {
        $logs = (object)array();

        $map_attendance = [];

        if($request->type == "student") {
            $logs = DB::select("SELECT * FROM attendance WHERE type = 'student' AND DATE_FORMAT(`date`, '%Y-%m') = ? AND qr_code = ?",[$request->date,$request->qrcode]);
            if(count($logs) > 0) {
                $start_date = current($logs)->date; 
                $dates = $start_date; 
                $month = date("Y-m", strtotime($dates));
                $map_attendance_timelogs = [];
                // echo "start date " . $start_date;
                foreach ($logs as $key => $value) {
                    // echo "<pre>";
                    // print_r($value);
                    // echo "<pre/>" . $dates;

                    // echo "<pre>";
                    // echo $value->date;
                    // echo "<pre/>";

                    if($dates == $value->date) { 
                        array_push($map_attendance_timelogs, $value);
                        if ($key === array_key_last($logs)) {
                            array_push($map_attendance, (object)[
                                'date' => $dates,
                                'month' => $month,
                                'logs' => $map_attendance_timelogs
                            ]);
                        }
                    } else if($dates != $value->date) { 
                        array_push($map_attendance, (object)[
                            'date' => $dates,
                            'month' => $month,
                            'logs' => $map_attendance_timelogs
                        ]);
                        $dates = $value->date;
                        $map_attendance_timelogs = [];            
                        array_push($map_attendance_timelogs, $value);
                    }
                    
                }
            }
        } else if($request->type == "employee") {
            $logs = DB::select("SELECT * FROM attendance WHERE (type = 'employee' OR type = 'teacher') AND DATE_FORMAT(`date`, '%Y-%m') = ? AND qr_code = ?",[$request->date,$request->qrcode]);
            if(count($logs) > 0) {
                $start_date = current($logs)->date; 
                $dates = $start_date; 
                $month = date("Y-m", strtotime($dates));
                $map_attendance_timelogs = [];
                foreach ($logs as $key => $value) {
                    if($dates == $value->date) {
                        array_push($map_attendance_timelogs, $value);
                        if ($key === array_key_last($logs)) {
                            array_push($map_attendance, (object)[
                                'date' => $dates,
                                'month' => $month,
                                'logs' => $map_attendance_timelogs
                            ]);
                        }
                    } else if($dates != $value->date) {
                        array_push($map_attendance, (object)[
                            'date' => $dates,
                            'month' => $month,
                            'logs' => $map_attendance_timelogs
                        ]);
                        $map_attendance_timelogs = [];
                        $dates = $value->date;
                        array_push($map_attendance_timelogs, $value);
                    }
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $map_attendance
        ], 200);

    }
    public function getFilterClassroomTimelogs(Request $request) {
        // $id = AuthenticatedSessionController::getAuthId(); 
        // if($id!=null) { 

            $logs = (object)array();
            // print_r($request->all());
            $student_attendance = [];
            if($request->type == "classroom" ) { 
                
                $map_student_list = DB::select('
                SELECT 
                ROW_NUMBER() OVER () as no,
                advisory_group.id,
                student.qr_code,
                CONCAT(student.last_name , \', \' , student.first_name) as fullname,
                student.first_name,
                student.last_name,
                student.middle_name,
                student.extension_name,
                student.flsh_strand,
                student.flsh_track,
                student.picture_base64 AS photo,
                student.id AS student_id,
                student.lrn,
                student.qr_code,
                student.sex,
                student.status AS \'student_status\'
                FROM advisory_group 
                LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
                LEFT JOIN student ON student.id = advisory_group.student_id
                WHERE advisory_group.status = \'active\' AND advisory.status = \'active\' AND advisory.qrcode = ?
                ',[$request->qrcode]);
                
                foreach ($map_student_list as $key => $svalue) {

                    $logs = DB::select("SELECT * FROM attendance WHERE type = 'student' AND DATE_FORMAT(`date`, '%Y-%m') = ? AND qr_code = ?",[$request->date,$svalue->qr_code]);
                    if(count($logs) > 0) {

                        $obj1 = array_merge((array)$svalue,(array)['logs' => $logs]);
                        array_push($student_attendance, $obj1);

                    } else {
                        
                        $obj1 = array_merge((array)$svalue,(array)['logs' => []]);
                        array_push($student_attendance, $obj1);
                    
                    }
                    
                    
                }
            }

            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $student_attendance
            ], 200);
        // } else {
        //     http_response_code(500);
        //     echo json_encode(['message' => 'Crazy thing just happened!' ]);
        //     exit();
        // }
    }
    public static function getFilterTimelogs_(Request $request) {
        $logs = (object)array();

        $map_attendance = [];

        if($request->type == "student") {
            $logs = DB::select("SELECT * FROM attendance WHERE type = 'student' AND DATE_FORMAT(`date`, '%Y-%m') = ? AND qr_code = ?",[$request->date,$request->qrcode]);
            if(count($logs) > 0) {
                $start_date = current($logs)->date; 
                $dates = $start_date; 
                $month = date("Y-m", strtotime($dates));
                $map_attendance_timelogs = [];
                foreach ($logs as $key => $value) {
                    if($dates == $value->date) {
                        array_push($map_attendance_timelogs, $value);
                    } else if($dates != $value->date) {
                        array_push($map_attendance, (object)[
                            'date' => $dates,
                            'month' => $month,
                            'logs' => $map_attendance_timelogs
                        ]);
                        $map_attendance_timelogs = [];
                        $dates = $value->date;
                        array_push($map_attendance_timelogs, $value);
                    }
                }
            }
        } else if($request->type == "employee") {
            $logs = DB::select("SELECT * FROM attendance WHERE (type = 'employee' OR type = 'teacher') AND DATE_FORMAT(`date`, '%Y-%m') = ? AND qr_code = ?",[$request->date,$request->qrcode]);
            if(count($logs) > 0) {
                $start_date = current($logs)->date; 
                $dates = $start_date; 
                $month = date("Y-m", strtotime($dates));
                $map_attendance_timelogs = [];
                foreach ($logs as $key => $value) {
                    if($dates == $value->date) {
                        array_push($map_attendance_timelogs, $value);
                    } else if($dates != $value->date) {
                        array_push($map_attendance, (object)[
                            'date' => $dates,
                            'month' => $month,
                            'logs' => $map_attendance_timelogs
                        ]);
                        $map_attendance_timelogs = [];
                        $dates = $value->date;
                        array_push($map_attendance_timelogs, $value);
                    }
                }
            }
        }

        return [
            'date' => $request->date,
            'qrcode' => $request->qrcode,
            'type' => $request->type,
            'logs' => $map_attendance
        ];

    }
    public function getAllTimelogs(Request $request) {
        $logs = [];
        if($request->type == "student") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND student_id = ? ',[$request->id]);
        } else if($request->type == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND teacher_id = ? ',[$request->id]);
        }

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $logs
        ], 200);

    }
    public function getClassTimelogs(Request $request) {
        $logs = (object)array();

        $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qrcode = ?',[$request->date,$request->qrcode]);

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $logs
        ], 200);

    }
    public function insertTimelogs(Request $request) {

        // echo "<pre>";
        // print($request); 
        // echo "</pre>";

        $logs = (object)array();
        // echo gettype($request->logsdata) . "<br>";
        // echo gettype($request->userdata) . "<br>"; 

        $logsdata = gettype($request->logsdata)=="string"? json_decode( $request->logsdata ,true) : $request->logsdata;
        $userdata = gettype($request->userdata)=="string"? json_decode( $request->userdata ,true) : $request->userdata;

        // echo "<pre>";
        // print_r($logsdata);
        // print_r($userdata);
        // echo "</pre>";
        $type = $userdata['type'];
        $student_id = null;
        $teacher_id = null;
        $contacts = [];
        $profile = null;
        $fullname = "";
        $phone_number = "";
        $messenger_id = "";
        $messenger_name = "";
        $date = $logsdata['date'];
        $time = $logsdata['time'];
        $mode = $logsdata['mode']=='IN'?'nakapasok':'nakalabas'; 
        if($userdata['type'] == "student") {
            $student_id = $userdata['id'];
            //Where('student_id',  $student_id)->
            // student_guardians
            $contacts = DB::table('contacts')->leftJoin('student_guardians', 'contacts.guardian_id',  'student_guardians.parents_id')->where('student_guardians.student_id', '=', $student_id)->get();
            $profile = DB::table('student')->where('id', $student_id)->get();
            $fullname = $profile[0]->first_name . ' ' . $profile[0]->last_name . ($profile[0]->extension_name != null ? " " .$profile[0]->extension_name:'');
            if($contacts->count()>0) {
                $phone_number = $contacts[0]->phone_number;
                $messenger_id = $contacts[0]->messenger_id;
                $messenger_name = $contacts[0]->messenger_name;
            }
        } else if($userdata['type'] == "teacher") {
            $teacher_id = $userdata['id'];
        }
        // echo "<pre>";
        // // print_r($contacts);
        // // print_r($profile);
        // print_r([
        //     'terminal' => 'kiosk',
        //     'terminal_id' => '',
        //     'type' => $type,
        //     'qr_code' => $logsdata['code'],
        //     'student_id' => $student_id,
        //     'teacher_id' => $teacher_id,
        //     'time' => $logsdata['time'],
        //     'date' => $logsdata['date'],
        //     'mode' => $logsdata['mode'],
        //     'status' => ""
        // ]);
        // echo $phone_number;
        // echo "\n";
        // echo $fullname;
        // echo "\n";
        // echo "</pre>";
        // insert timelogs
        $insertAttendance = Attendance::create([
            'terminal' => "kiosk",
            'terminal_id' => "",
            'type' => $type,// student or employee(teacher,staff)
            'qr_code' => $logsdata['code'],
            'student_id' => $student_id,
            'teacher_id' => $teacher_id,
            'time' => $logsdata['time'],
            'date' => $logsdata['date'],
            'mode' => $logsdata['mode'],
            'status' => ""
        ]);
        if($userdata['type'] == "student") {
            // $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
            // --------------------------------------------------------------------------------------------------------------------------------------
            // send via sms
            $message = 'Matagumpay ' . $mode . ' sa Paaralan ng Lebak Legislated NHS si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
            if($phone_number != "") {
                $notif_id = Notifications::factory()->create([
                    'type' => 'sms',
                    'to' => $phone_number,
                    'message' => $message,
                    'status' => 'sending',
                    'date' => $date,
                    'time' => $time
                ])['id'];
    
                // $push_noti_id = Notifications::factory()->create([
                //     'type' => 'push',
                //     'to' => $phone_number,
                //     'message' => $message,
                //     'status' => 'sending',
                //     'date' => $date,
                //     'time' => $date
                // ])['id'];
    
                $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                Process::start($command);
            }
            if($messenger_id != "") {
                $notif_id = Notifications::factory()->create([
                    'type' => 'fb',
                    'to' => $messenger_id,
                    'message' => $message,
                    'status' => 'sending',
                    'date' => $date,
                    'time' => $time
                ])['id'];
    
                // $push_noti_id = Notifications::factory()->create([
                //     'type' => 'push',
                //     'to' => $phone_number,
                //     'message' => $message,
                //     'status' => 'sending',
                //     'date' => $date,
                //     'time' => $date
                // ])['id'];
    
                $command = "php " . base_path('artisan') . " process:process-send-messenger-command " . escapeshellarg($messenger_id) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                Process::start($command);
            }
            // --------------------------------------------------------------------------------------------------------------------------------------
        } else if($userdata['type'] == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);

        
    }
    public function insertTimeTogsByClassV1(Request $request) {
 
        $logs = (object)array(); 

        $logsdata = gettype($request->logsdata)=="string"? json_decode($request->logsdata,true) : $request->logsdata;
        $userdata = gettype($request->userdata)=="string"? json_decode($request->userdata,true) : $request->userdata;

        // echo "<pre>";
        // print_r($logsdata);
        // // print_r($userdata);
        // echo "</pre>";
        $type = $userdata['type'];
        $student_id = null;
        $teacher_id = null;
        $contacts = [];
        $profile = null;
        $fullname = "";
        $phone_number = "";
        $class_subject = $logsdata['subject_name'];

        $enable_sms = false;
        $enable_fb = false;
        $enable_noti = false;
        $notification = false;

        $fullname = "";
        $message = "";
        $phone_number = "";
        $messenger_id = "";

        $notification_settings = DB::table('system_settings')->get();
        if($notification_settings->count() > 0) { 
            foreach($notification_settings as $key => $val) { 
                if($val->setting === 'ENABLE_SMS') {
                    if($val->value == 'true') {
                        $enable_sms = true;
                    } else if($val->value == 'false') {
                        $enable_sms = false;
                    }
                } else if($val->setting === 'ENABLE_FB_MESSENGER') {
                    if($val->value == 'true') {
                        $enable_fb = true;
                    } else if($val->value == 'false') {
                        $enable_fb = false;
                    }
                } else if($val->setting === 'ENABLE_PUSH_NOTIFICATION') {
                    if($val->value == 'true') {
                        $enable_noti = true;
                    } else if($val->value == 'false') {
                        $enable_noti = false;
                    }
                }
            }
        }


        $date = $logsdata['date'];
        $time = $logsdata['time'];
        $mode = $logsdata['mode']=='IN'?'nakapasok':'nakalabas'; 
        if($userdata['type'] == "student") {
            $student_id = $userdata['id'];
            //Where('student_id',  $student_id)->
            // student_guardians
            $contacts = DB::table('contacts')->leftJoin('student_guardians', 'contacts.guardian_id',  'student_guardians.parents_id')->where('student_guardians.student_id', '=', $student_id)->get();
            $profile = DB::table('student')->where('id', $student_id)->get();
            $fullname = $profile[0]->first_name . ' ' . $profile[0]->last_name . ($profile[0]->extension_name != null ? " " .$profile[0]->extension_name:'');

            if($logsdata['mode']=='IN') {
                $message = sprintf(env('ATTENDANCE_CLASS_STUDENT_PRESENT'),$class_subject,$fullname,$time,$date);
            } else {
                $message = sprintf(env('ATTENDANCE_CLASS_STUDENT_ABSENT'),$class_subject,$fullname,$time,$date);
            }

            if($contacts->count()>0) {
                $phone_number = $contacts[0]->phone_number;
                $messenger_id = $contacts[0]->messenger_id;
            }
            $notification = true;
        } else if($userdata['type'] == "teacher") {
            $teacher_id = $userdata['id'];
        } 

        Attendance::create([
            'terminal' => "mobile",
            'terminal_id' => "class_id_" .  $logsdata['class_id'] . "_teacher_id_" . $logsdata['teacher_id'],
            'type' => $type,// student or employee(teacher,staff)
            'qr_code' => $logsdata['code'],
            'student_id' => $student_id,
            'teacher_id' => $teacher_id,
            'time' => $logsdata['time'],
            'date' => $logsdata['date'],
            'mode' => $logsdata['mode'],
            'status' => "class_present"
        ]);

        if($userdata['type'] == "student") {
            if($notification == true) { 
                if($phone_number != "" && $enable_sms == true) {
                    $sms_id = Notifications::factory()->create([
                        'type' => 'sms',
                        'to' => $phone_number,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                    
                    $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
                    Process::start($command);
                }
                // --------------------------------------------------------------------------------------------------------------------------------------
                if($messenger_id != "" && $enable_fb == true) {
                    $notif_id = Notifications::factory()->create([
                        'type' => 'fb',
                        'to' => $messenger_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
        
                    $command = "php " . base_path('artisan') . " process:process-send-messenger-command " . escapeshellarg($messenger_id) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                    Process::start($command);
                }
                if(($phone_number == "" || $messenger_id == "") && $enable_noti == true) {
                    Notifications::factory()->create([
                        'type' => 'push',
                        'to' => 'student_' . $student_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                }
            }
            // $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
            // // --------------------------------------------------------------------------------------------------------------------------------------
            // // send via sms
            // $message = 'Matagumpay naka ' . $mode . ' sa klase si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
            // if($phone_number!="") {
            //     $sms_id = Notifications::factory()->create([
            //         'type' => 'sms',
            //         'to' => $phone_number,
            //         'message' => $message,
            //         'status' => 'sending',
            //         'date' => $date,
            //         'time' => $date
            //     ])['id'];
    
            //     $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
            //     Process::start($command);
            // }
            // --------------------------------------------------------------------------------------------------------------------------------------
        } else if($userdata['type'] == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);

        
    }
    public function insertTimeTogsByClass(Request $request) {
 
        $type = $request->type;
        $student_id = null;
        $teacher_id = $request->teacher_id;
        $contacts = [];
        $profile = null;
        $date = $request->date;
        $time = $request->time;
        $mode = $request->mode=='IN'?'nakapasok':'nakalabas'; 
        $class_subject = $request->class_subject;
        $student_attendance_list = $request->student_attendance;

        $enable_sms = false;
        $enable_fb = false;
        $enable_noti = false;

        $notification_settings = DB::table('system_settings')->get();
        if($notification_settings->count() > 0) { 
            foreach($notification_settings as $key => $val) { 
                if($val->setting === 'ENABLE_SMS') {
                    if($val->value == 'true') {
                        $enable_sms = true;
                    } else if($val->value == 'false') {
                        $enable_sms = false;
                    }
                } else if($val->setting === 'ENABLE_FB_MESSENGER') {
                    if($val->value == 'true') {
                        $enable_fb = true;
                    } else if($val->value == 'false') {
                        $enable_fb = false;
                    }
                } else if($val->setting === 'ENABLE_PUSH_NOTIFICATION') {
                    if($val->value == 'true') {
                        $enable_noti = true;
                    } else if($val->value == 'false') {
                        $enable_noti = false;
                    }
                }
            }
        }


        foreach($student_attendance_list as $key => $val) {
            $fullname = "";
            $phone_number = "";
            $messenger_id = "";

            $mode = $val['status']=='present'?'present':'absent'; 
            $notification = false;
            $student_id = $val['student_id']; 

            $attendances = DB::table('attendance')
            ->where('student_id', $student_id)
            ->where('teacher_id', $teacher_id) 
            ->where('date', $date)
            ->where('type', $type)->get();

            if($attendances->count() == 0) {
                Attendance::create([
                    'terminal' => "web",
                    'terminal_id' => "class_id_" .  $request->class_id . "_teacher_id_" . $request->teacher_id,
                    'type' => $type,// student or employee(teacher,staff)
                    'qr_code' => $val['lrn'],
                    'student_id' => $student_id,
                    'teacher_id' => $request->teacher_id,
                    'time' => $time,
                    'date' => $date,
                    'mode' => $mode,
                    'status' => "class_present"
                ]);
                $notification = true;
            } else if($attendances->count() > 0){
                if($attendances[0]->mode === "absent" && $mode === "present") {
                    DB::table('attendance')
                    ->where('student_id', $student_id)
                    ->where('teacher_id', $teacher_id) 
                    ->where('date', $date)
                    ->where('type', $type)->update(['mode' => $mode]);                    
                    $notification = true;                 
                } else if($attendances[0]->mode === "present" && $mode === "absent") {
                    DB::table('attendance')
                    ->where('student_id', $student_id)
                    ->where('teacher_id', $teacher_id) 
                    ->where('date', $date)
                    ->where('type', $type)->update(['mode' => $mode]);
                    $notification = true;
                }
            }
            if($notification == true) {
                // --------------------------------------------------------------------------------------------------------------------------------------
                // send via sms
                $contacts = DB::table('contacts')->leftJoin('student_guardians', 'contacts.guardian_id',  'student_guardians.parents_id')->where('student_guardians.student_id', '=', $student_id)->get();
                $profile = DB::table('student')->where('id', $student_id)->get();
                $fullname = $profile[0]->first_name . ' ' . $profile[0]->last_name . ($profile[0]->extension_name != null ? " " .$profile[0]->extension_name:'');

                if($val['status']=='present') {
                    $message = sprintf(env('ATTENDANCE_CLASS_STUDENT_PRESENT'),$class_subject,$fullname,$time,$date);
                } else {
                    $message = sprintf(env('ATTENDANCE_CLASS_STUDENT_ABSENT'),$class_subject,$fullname,$time,$date);
                }
                
                if($contacts->count()>0) {
                    $phone_number = $contacts[0]->phone_number;
                    $messenger_id = $contacts[0]->messenger_id;
                }
                
                // $message = 'Matagumpay naka ' . $mode . ' sa klase si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
                if($phone_number != "" && $enable_sms == true) {
                    $sms_id = Notifications::factory()->create([
                        'type' => 'sms',
                        'to' => $phone_number,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                    
                    $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
                    Process::start($command);
                }
                // --------------------------------------------------------------------------------------------------------------------------------------
                if($messenger_id != "" && $enable_fb == true) {
                    $notif_id = Notifications::factory()->create([
                        'type' => 'fb',
                        'to' => $messenger_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
        
                    $command = "php " . base_path('artisan') . " process:process-send-messenger-command " . escapeshellarg($messenger_id) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                    Process::start($command);
                }
                if(($phone_number == "" || $messenger_id == "") && $enable_noti == true) {
                    Notifications::factory()->create([
                        'type' => 'push',
                        'to' => 'student_' . $student_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                }

            }

        }



        // if($$request->type == "student") {
        //     $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        //     // --------------------------------------------------------------------------------------------------------------------------------------
        //     // send via sms
        //     $message = 'Matagumpay naka ' . $mode . ' sa klase si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
        //     if($phone_number!="") {
        //         $sms_id = Notifications::factory()->create([
        //             'type' => 'sms',
        //             'to' => $phone_number,
        //             'message' => $message,
        //             'status' => 'sending',
        //             'date' => $date,
        //             'time' => $date
        //         ])['id'];
    
        //         $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
        //         Process::start($command);
        //     }
        //     // --------------------------------------------------------------------------------------------------------------------------------------
        // } else if($userdata['type'] == "teacher") {
        //     $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        // }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);

        
    }
    public function insertTimeTogsByEvent(Request $request) {
 
        
        $logsdata = gettype($request->logsdata)=="string"? json_decode($request->logsdata,true) : $request->logsdata;
        $userdata = gettype($request->userdata)=="string"? json_decode($request->userdata,true) : $request->userdata;

        // echo "<pre>";
        // print_r($logsdata);
        // // print_r($userdata);
        // echo "</pre>";
        $type = $userdata['type'];
        $student_id = null;
        $teacher_id = null;
        $contacts = [];
        $profile = null;
        $fullname = "";
        $phone_number = "";
        $class_subject = $logsdata['subject_name'];

        $enable_sms = false;
        $enable_fb = false;
        $enable_noti = false;
        $notification = false;

        $fullname = "";
        $message = "";
        $phone_number = "";
        $messenger_id = "";

        $notification_settings = DB::table('system_settings')->get();
        if($notification_settings->count() > 0) { 
            foreach($notification_settings as $key => $val) { 
                if($val->setting === 'ENABLE_SMS') {
                    if($val->value == 'true') {
                        $enable_sms = true;
                    } else if($val->value == 'false') {
                        $enable_sms = false;
                    }
                } else if($val->setting === 'ENABLE_FB_MESSENGER') {
                    if($val->value == 'true') {
                        $enable_fb = true;
                    } else if($val->value == 'false') {
                        $enable_fb = false;
                    }
                } else if($val->setting === 'ENABLE_PUSH_NOTIFICATION') {
                    if($val->value == 'true') {
                        $enable_noti = true;
                    } else if($val->value == 'false') {
                        $enable_noti = false;
                    }
                }
            }
        }


        $date = $logsdata['date'];
        $time = $logsdata['time'];
        $mode = $logsdata['mode']=='IN'?'nakapasok':'nakalabas'; 
        if($userdata['type'] == "student") {
            $student_id = $userdata['id'];
            //Where('student_id',  $student_id)->
            // student_guardians
            $contacts = DB::table('contacts')->leftJoin('student_guardians', 'contacts.guardian_id',  'student_guardians.parents_id')->where('student_guardians.student_id', '=', $student_id)->get();
            $profile = DB::table('student')->where('id', $student_id)->get();
            $fullname = $profile[0]->first_name . ' ' . $profile[0]->last_name . ($profile[0]->extension_name != null ? " " .$profile[0]->extension_name:'');

            if($logsdata['mode']=='IN') {
                $message = sprintf(env('ATTENDANCE_CLASS_STUDENT_PRESENT'),$class_subject,$fullname,$time,$date);
            } else {
                $message = sprintf(env('ATTENDANCE_CLASS_STUDENT_ABSENT'),$class_subject,$fullname,$time,$date);
            }

            if($contacts->count()>0) {
                $phone_number = $contacts[0]->phone_number;
                $messenger_id = $contacts[0]->messenger_id;
            }
            // $notification = true;
        } else if($userdata['type'] == "teacher") {
            $teacher_id = $userdata['id'];
        } 

        Attendance::create([
            'terminal' => "web",
            'terminal_id' => "event_id_" .  $logsdata['class_id'] . "_teacher_id_" . $logsdata['teacher_id'],
            'type' => $type,// student or employee(teacher,staff)
            'qr_code' => $logsdata['code'],
            'student_id' => $student_id,
            'teacher_id' => $teacher_id,
            'time' => $logsdata['time'],
            'date' => $logsdata['date'],
            'mode' => $logsdata['mode'],
            'status' => "event_present"
        ]);

        if($userdata['type'] == "student") {
            if($notification == true) { 
                if($phone_number != "" && $enable_sms == true) {
                    $sms_id = Notifications::factory()->create([
                        'type' => 'sms',
                        'to' => $phone_number,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                    
                    $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
                    Process::start($command);
                }
                // --------------------------------------------------------------------------------------------------------------------------------------
                if($messenger_id != "" && $enable_fb == true) {
                    $notif_id = Notifications::factory()->create([
                        'type' => 'fb',
                        'to' => $messenger_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
        
                    $command = "php " . base_path('artisan') . " process:process-send-messenger-command " . escapeshellarg($messenger_id) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                    Process::start($command);
                }
                if(($phone_number == "" || $messenger_id == "") && $enable_noti == true) {
                    Notifications::factory()->create([
                        'type' => 'push',
                        'to' => 'student_' . $student_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                }
            }
            // $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
            // // --------------------------------------------------------------------------------------------------------------------------------------
            // // send via sms
            // $message = 'Matagumpay naka ' . $mode . ' sa klase si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
            // if($phone_number!="") {
            //     $sms_id = Notifications::factory()->create([
            //         'type' => 'sms',
            //         'to' => $phone_number,
            //         'message' => $message,
            //         'status' => 'sending',
            //         'date' => $date,
            //         'time' => $date
            //     ])['id'];
    
            //     $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
            //     Process::start($command);
            // }
            // --------------------------------------------------------------------------------------------------------------------------------------
        } else if($userdata['type'] == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);

    }
    public function insertTimeTogsByEmergency(Request $request) {
 
        
        $logsdata = gettype($request->logsdata)=="string"? json_decode($request->logsdata,true) : $request->logsdata;
        $userdata = gettype($request->userdata)=="string"? json_decode($request->userdata,true) : $request->userdata;

        // echo "<pre>";
        // print_r($logsdata);
        // // print_r($userdata);
        // echo "</pre>";
        $type = $userdata['type'];
        $student_id = null;
        $teacher_id = null;
        $contacts = [];
        $profile = null;
        $fullname = "";
        $phone_number = "";
        $class_subject = $logsdata['subject_name'];

        $enable_sms = false;
        $enable_fb = false;
        $enable_noti = false;
        $notification = false;

        $fullname = "";
        $message_s = $logsdata['message'];
        $message = "";
        $phone_number = "";
        $messenger_id = "";

        $notification_settings = DB::table('system_settings')->get();
        if($notification_settings->count() > 0) { 
            foreach($notification_settings as $key => $val) { 
                if($val->setting === 'ENABLE_SMS') {
                    if($val->value == 'true') {
                        $enable_sms = true;
                    } else if($val->value == 'false') {
                        $enable_sms = false;
                    }
                } else if($val->setting === 'ENABLE_FB_MESSENGER') {
                    if($val->value == 'true') {
                        $enable_fb = true;
                    } else if($val->value == 'false') {
                        $enable_fb = false;
                    }
                } else if($val->setting === 'ENABLE_PUSH_NOTIFICATION') {
                    if($val->value == 'true') {
                        $enable_noti = true;
                    } else if($val->value == 'false') {
                        $enable_noti = false;
                    }
                }
            }
        }

        $date = $logsdata['date'];
        $time = $logsdata['time'];
        $mode = $logsdata['mode']=='IN'?'nakapasok':'nakalabas'; 
        if($userdata['type'] == "student") {
            $student_id = $userdata['id'];
            //Where('student_id',  $student_id)->
            // student_guardians
            $contacts = DB::table('contacts')->leftJoin('student_guardians', 'contacts.guardian_id',  'student_guardians.parents_id')->where('student_guardians.student_id', '=', $student_id)->get();
            $profile = DB::table('student')->where('id', $student_id)->get();
            $fullname = $profile[0]->first_name . ' ' . $profile[0]->last_name . ($profile[0]->extension_name != null ? " " .$profile[0]->extension_name:'');

            // if($logsdata['mode']=='IN') {
                $message = sprintf($message_s,$fullname,$time,$date);
            // } else {
            //     $message = sprintf($message_s,$fullname,$time,$date);
            // }

            if($contacts->count()>0) {
                $phone_number = $contacts[0]->phone_number;
                $messenger_id = $contacts[0]->messenger_id;
            }
            $notification = true;
        } else if($userdata['type'] == "teacher") {
            $teacher_id = $userdata['id'];
        } 

        // Attendance::create([
        //     'terminal' => "web",
        //     'terminal_id' => "event_id_" .  $logsdata['class_id'] . "_teacher_id_" . $logsdata['teacher_id'],
        //     'type' => $type,// student or employee(teacher,staff)
        //     'qr_code' => $logsdata['code'],
        //     'student_id' => $student_id,
        //     'teacher_id' => $teacher_id,
        //     'time' => $logsdata['time'],
        //     'date' => $logsdata['date'],
        //     'mode' => $logsdata['mode'],
        //     'status' => "event_present"
        // ]);

        if($userdata['type'] == "student") {
            if($notification == true) { 
                if($phone_number != "" && $enable_sms == true) {
                    $sms_id = Notifications::factory()->create([
                        'type' => 'sms',
                        'to' => $phone_number,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                    
                    $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
                    Process::start($command);
                }
                // --------------------------------------------------------------------------------------------------------------------------------------
                if($messenger_id != "" && $enable_fb == true) {
                    $notif_id = Notifications::factory()->create([
                        'type' => 'fb',
                        'to' => $messenger_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
        
                    $command = "php " . base_path('artisan') . " process:process-send-messenger-command " . escapeshellarg($messenger_id) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                    Process::start($command);
                }
                if(($phone_number == "" || $messenger_id == "") && $enable_noti == true) {
                    Notifications::factory()->create([
                        'type' => 'push',
                        'to' => 'student_' . $student_id,
                        'message' => $message,
                        'status' => 'sending',
                        'date' => $date,
                        'time' => $time
                    ])['id'];
                }
            }
            // $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
            // // --------------------------------------------------------------------------------------------------------------------------------------
            // // send via sms
            // $message = 'Matagumpay naka ' . $mode . ' sa klase si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
            // if($phone_number!="") {
            //     $sms_id = Notifications::factory()->create([
            //         'type' => 'sms',
            //         'to' => $phone_number,
            //         'message' => $message,
            //         'status' => 'sending',
            //         'date' => $date,
            //         'time' => $date
            //     ])['id'];
    
            //     $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($sms_id);
            //     Process::start($command);
            // }
            // --------------------------------------------------------------------------------------------------------------------------------------
        } else if($userdata['type'] == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);

    }
    public function insertTimeTogsClassByStudent(Request $request) {

        $logsdata = gettype($request->logsdata)=="string"? json_decode( $request->logsdata ,true) : $request->logsdata;
        $userdata = gettype($request->userdata)=="string"? json_decode( $request->userdata ,true) : $request->userdata;

        $type = $userdata['type'];
        $student_id = null;
        $teacher_id = null;
        $contacts = [];
        $profile = null;
        $fullname = "";
        $phone_number = "";
        $messenger_id = "";
        $messenger_name = "";
        $date = $logsdata['date'];
        $time = $logsdata['time'];
        $mode = $logsdata['mode']=='IN'?'nakapasok':'nakalabas'; 

        $notification = false;

        if($userdata['type'] == "student") {
            $student_id = $userdata['id'];
            //Where('student_id',  $student_id)->
            // student_guardians
            $contacts = DB::table('contacts')->leftJoin('student_guardians', 'contacts.guardian_id',  'student_guardians.parents_id')->where('student_guardians.student_id', '=', $student_id)->get();
            $profile = DB::table('student')->where('id', $student_id)->get();
            $fullname = $profile[0]->first_name . ' ' . $profile[0]->last_name . ($profile[0]->extension_name != null ? " " .$profile[0]->extension_name:'');
            if($contacts->count()>0) {
                $phone_number = $contacts[0]->phone_number;
                $messenger_id = $contacts[0]->messenger_id;
                $messenger_name = $contacts[0]->messenger_name;
            }
        }

        Attendance::create([
            'terminal' => "web_mobile",
            'terminal_id' => "classroom_scan",
            'type' => $type,// student or employee(teacher,staff)
            'qr_code' => $logsdata['code'],
            'student_id' => $student_id,
            'teacher_id' => null,
            'time' => $logsdata['time'],
            'date' => $logsdata['date'],
            'mode' => $logsdata['mode'],
            'status' => ""
        ]);

        if($notification == true && $userdata['type'] == "student") {
            
            // --------------------------------------------------------------------------------------------------------------------------------------
            // send via sms
            $message = 'Matagumpay ' . $mode . ' sa Paaralan ng Lebak Legislated NHS si ' . $fullname . ' sa saktong '  . $time . ' ' . $date; 
            if($phone_number != "") {
                $notif_id = Notifications::factory()->create([
                    'type' => 'sms',
                    'to' => $phone_number,
                    'message' => $message,
                    'status' => 'sending',
                    'date' => $date,
                    'time' => $time
                ])['id']; 
    
                $command = "php " . base_path('artisan') . " process:send-sms " . escapeshellarg($phone_number) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                Process::start($command);
            }
            if($messenger_id != "") {
                $notif_id = Notifications::factory()->create([
                    'type' => 'fb',
                    'to' => $messenger_id,
                    'message' => $message,
                    'status' => 'sending',
                    'date' => $date,
                    'time' => $time
                ])['id']; 

                $command = "php " . base_path('artisan') . " process:process-send-messenger-command " . escapeshellarg($messenger_id) . " " . escapeshellarg($message) . " " . escapeshellarg($notif_id);
                Process::start($command);
            }
            // --------------------------------------------------------------------------------------------------------------------------------------
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);
        
    }
    public static function myTimelogs($utype,$id) {

        $map_attendance = [];

        if($utype == "student") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND student_id = ? ',[$id]);
            if(count($logs) > 0) {
                $start_date = current($logs)->date; 
                $dates = $start_date; 
                $month = date("Y-m", strtotime($dates));
                $map_attendance_timelogs = [];
                foreach ($logs as $key => $value) {
                    if($dates == $value->date) {
                        array_push($map_attendance_timelogs, $value);
                    } else if($dates != $value->date) {
                        array_push($map_attendance, (object)[
                            'date' => $dates,
                            'month' => $month,
                            'logs' => $map_attendance_timelogs
                        ]);
                        $map_attendance_timelogs = [];
                        $dates = $value->date;
                        array_push($map_attendance_timelogs, $value);
                    }
                }
            }
            return $map_attendance;
        } else if($utype != "student") {
            $logs = DB::select('SELECT * FROM attendance WHERE type <> "student" AND teacher_id = ? ',[$id]);  
            if(count($logs) > 0) {
                $start_date = current($logs)->date; 
                $dates = $start_date; 
                $month = date("Y-m", strtotime($dates));
                $map_attendance_timelogs = [];
                foreach ($logs as $key => $value) {
                    if($dates == $value->date) {
                        array_push($map_attendance_timelogs, $value);
                    } else if($dates != $value->date) {
                        array_push($map_attendance, (object)[
                            'date' => $dates,
                            'month' => $month,
                            'logs' => $map_attendance_timelogs
                        ]);
                        $map_attendance_timelogs = [];
                        $dates = $value->date;
                        array_push($map_attendance_timelogs, $value);
                    }
                }
            }
            return $map_attendance;
        } else {
            return [];
        }
    }
    public function getUserTimelogs(Request $request) {

        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);
    }
    public function geTodayTimelogs(Request $request) {
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);
    }
}
