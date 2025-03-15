<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Notifications;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
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
        $Teacher = DB::table('teacher')
        ->where('qr_code', '=', $request->code)
        ->get();

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

        $logs = DB::select('SELECT * FROM attendance WHERE  date = ? ',[$request->date]);
        $attendance = array();
        foreach($logs as $key => $val) { 
            
            $teacher = is_null($val->teacher_id) ? null: DB::table('teacher')->where('id', $val->teacher_id)->get();
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
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qrcode = ?',[$request->date,$request->qrcode]);
        } else if($request->type == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qrcode = ?',[$request->date,$request->qrcode]);
        }

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
            $phone_number = $contacts[0]->phone_number;
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
        // $insertAttendance = Attendance::create([
        //     'terminal' => "kiosk",
        //     'terminal_id' => "",
        //     'type' => $type,
        //     'qr_code' => $logsdata['code'],
        //     'student_id' => $student_id,
        //     'teacher_id' => $teacher_id,
        //     'time' => $logsdata['time'],
        //     'date' => $logsdata['date'],
        //     'mode' => $logsdata['mode'],
        //     'status' => ""
        // ]);
        // send via sms
        // error_reporting(E_ALL);
        $message = 'Matagumpay ' . $mode . ' sa Paaralan ng Lebak Legislated NHS si ' . $fullname . ' sa saktong '  . $time . ' ' . $date;
        // $request_sms = Request::create(
        //     '/sms/send/attendance',
        //     'POST',
        //     ['phone_number' => $phone_number,'message' => $message],
        //     [], // Cookies
        //     [], // Files
        //     ['Content-Type' => 'application/x-www-form-urlencoded']); 
        // $targetController = app(TargetController::class);
        // $targetController->process($request_sms);
        // SMSController::SendSMS($request_sms);
        // $logs = (object)array('phone_number' => $phone_number,'message' => $message);
        
        // $sms_result = SMSController::_SendSMS((object)array('phone_number' => $phone_number,'message' => $message));
        // echo "< br />"; 
        // print_r($sms_result);
        
        Notifications::factory()->create([
            'type' => 'sms',
            'to' => $phone_number,
            'message' => $message,
            'status' => 'sending',
            'date' => $date,
            'time' => $date
        ]);

        Notifications::factory()->create([
            'type' => 'push',
            'to' => $phone_number,
            'message' => $message,
            'status' => 'sending',
            'date' => $date,
            'time' => $date
        ]);

        if($userdata['type'] == "student") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        } else if($userdata['type'] == "teacher") {
            $logs = DB::select('SELECT * FROM attendance WHERE type = "student" AND date = ? AND qr_code = ?',[$logsdata['date'],$logsdata['code']]);
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);

        
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
