<?php

namespace App\Http\Controllers;

use App\Models\Contacts;
use App\Models\Employee;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    public function index() 
    {
        $teacher = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type = \'Teacher\';');
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $teacher
        ],200);
    }
    public static function getAll() 
    {
        return  Employee::all();
    }
    public static function getData($id)
    {
        $teacher =  Employee::findOrFail($id);
        return $teacher;
    }
    public static function getData2($id)
    {
        // $student = Teacher::findOrFail($id);
        // return $student;
        $teacher = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type = \'Teacher\' AND id = ?;',[$id]);
        return $teacher;
    }
    public static function getDataQR($id)
    {
        // $student = Teacher::findOrFail($id);
        // return $student;
        $teacher = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,employee_type,picture_base64,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type = \'Teacher\' AND qr_code = ?;',[$id]);
        return $teacher;
    }
    public static function getContacts($id)
    { 
        return  DB::select('SELECT * FROM contacts WHERE teacher_id = ?',[$id]);
    }
    public function show($id)
    {
        $student =  Employee::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $student
        ], 200);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string',
            'email' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $contact_list = $request->contact_list;
        // echo $request;
        $Student = DB::table('teacher')
                ->where('first_name', '=', $request->first_name)
                ->orWhere('last_name', '=', $request->last_name)
                ->orWhere('email', '=', $request->email)
                ->get();

        if($Student->count()==0) {
            $customer = Teacher::create($request->except(['contact_list']));
            if($contact_list != NULL) {
                foreach($contact_list as $key => $val) {
                    $temp = DB::table('contacts')->where('teacher_id',$customer->id)->where('phone_number',$val['phone_number'])->get(); 
                    if($temp->count() == 0) {
                        Contacts::create([
                            'type' => 'teacher',
                            'teacher_id' => $customer->id,
                            'phone_number' => $val['phone_number'],
                            'status' => 'active'
                        ]);
                    }
                }
            } 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $customer
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA EXIST",
                'data' => []
            ], 200);
        }


    }
    public function update(Request $request) {
        $validator = Validator::make($request->all(), [ 
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string',
            'email' => 'required|string'
        ]);
        $contact_list = $request->contact_list;
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $teacher = DB::table('teacher')->where('id', $request->id)->get();
        // $teacher = DB::table('teacher')
        //         ->where('first_name', '=', $request->first_name)
        //         ->orWhere('last_name', '=', $request->last_name)
        //         ->get();

        if($teacher->count()==1) {
            
            $teacher = DB::table('teacher')->where('id', $request->id)->update($request->except(['id','contact_list']));
            if($contact_list != NULL) {
                foreach($contact_list as $key => $val) {
                    $temp = DB::table('contacts')->where('teacher_id',$val['teacher_id'])->where('phone_number',$val['phone_number'])->get(); 
                    if($temp->count() == 0) {
                        Contacts::create([
                            'type' => 'teacher',
                            'teacher_id' => $val['teacher_id'],
                            'phone_number' => $val['phone_number'],
                            'status' => 'active'
                        ]);
                    }
                }
            } 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $contact_list
            ], 201);

        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT EXIST",
                'data' => []
            ], 200);
        }
    }
    public function remove(Request $request) {
        $Student = DB::table('teacher')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('teacher')->where('id', $request->id)->update(['status'=>'remove']);            
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $updateStudent
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT FOUND",
                'data' => []
            ], 200);
        }
    }
}
