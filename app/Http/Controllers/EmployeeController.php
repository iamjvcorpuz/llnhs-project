<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Contacts;
use App\Models\EmployeeEB;
use App\Models\EmployeeTrainings;
use App\Models\Teacher;
use App\Models\UserAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function index() 
    {
        $student = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,employee_type,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t;');
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200);
    }
    public static function index_() 
    {
        $student = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,\'\' AS \'picture_base64\',employee_type,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t;');
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200);
    }
    public static function getAll() 
    {
        return Employee::all();
    }
    public static function getCount() 
    {
        return DB::select('SELECT COUNT(*) AS TOTAL FROM employee WHERE employee_type = "Teacher" AND status = "active" ' );
    }
    public static function getAllTeacher() 
    {
        $teacher = DB::select('SELECT ROW_NUMBER() OVER () as "index",uuid,id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,employee_type,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type = \'Teacher\' ;');
        // return Employee::all();
        return $teacher;
    }
    public static function getAllNONETeacher() 
    {
        $employee = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,qr_code,first_name,last_name,middle_name,extension_name,bdate,sex,status,email,picture_base64,employee_type,(SELECT COUNT(*) FROM advisory AS a WHERE a.teacher_id = t.id AND a.status = \'active\') AS \'total_advisory\' FROM employee AS t WHERE employee_type != \'Teacher\' ;');
        // return Employee::all();
        return $employee;
    }
    public static function getData($id)
    {
        $student = Employee::findOrFail($id);
        return $student;
    }
    public static function getContacts($id)
    { 
        return  DB::select('SELECT * FROM contacts WHERE teacher_id = ?',[$id]);
    }
    
    public static function getEB($id)
    { 
        return  DB::select('SELECT * FROM education_background WHERE employee_id = ?',[$id]);
    }
    public static function getTrainings($id)
    { 
        return  DB::select('SELECT * FROM tranings WHERE employee_id = ?',[$id]);
    }
    
    public function show($id)
    {
        $student = Employee::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $student
        ], 200);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'employee_type' => 'required|string',
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
        $Student = DB::table('employee')
                ->where('first_name', '=', $request->first_name)
                ->where('last_name', '=', $request->last_name)
                ->where('email', '=', $request->email)
                ->get();

        if($Student->count()==0) {
            $customer = Employee::create($request->except(['contact_list','EB_list','training_list']));
            DB::table('employee')->where('id', $customer->id)->update(['uuid' => $customer->id]);

            $firstname = $request->first_name;
            $lastname = $request->last_name;
            $parts = explode(" ", $firstname);
            $usernames = "";
            $password = $request->lrn;
            
            foreach($parts as $value) {
                $usernames= $usernames . $value[0];
            }

            $usernames = $usernames . ucfirst(strtolower($lastname));


            $UserAccounts = UserAccounts::create([
                'user_id' => $customer->id,
                'user_type' => $request->employee_type,
                'user_role_id' => ($request->employee_type=="Teacher")?2:5,
                'fullname' => $firstname . " " . $lastname,
                'username' => $usernames,
                'password' => Hash::make($usernames),
                'plainpassword' => $usernames,
                'verified' => null
            ]);
            DB::table('user_accounts')->where('id', $UserAccounts->id)->update(['uuid' => $UserAccounts->id]);

            // EB_list
            $eb = $request->EB_list;
            if($eb != NULL) {
                $eb_query = DB::table('education_background')->where('id', $customer->id)->get();
                if($eb_query->count()==0) {
                    foreach($eb as $key => $val) {
                        $level = isset($val['level']) ? $val['level'] : "";
                        $name_of_school = isset($val['name_of_school']) ? $val['name_of_school'] : "";
                        $basic_edu_degree_course = isset($val['basic_edu_degree_course']) ? $val['basic_edu_degree_course'] : "";
                        $period_from = isset($val['period_from']) ? $val['period_from'] : "";
                        $period_to = isset($val['period_to']) ? $val['period_to'] : "";
                        $units = isset($val['units']) ? $val['units'] : "";
                        $yr_graduated = isset($val['yr_graduated']) ? $val['yr_graduated'] : "";
                        $ac_ah_recieve = isset($val['ac_ah_recieve']) ? $val['ac_ah_recieve'] : "";
                        EmployeeEB::create([
                            'employee_id' => $customer->id,
                            'level' => $level, 
                            'name_of_school' => $name_of_school,
                            'basic_edu_degree_course' => $basic_edu_degree_course,
                            'period_from' => $period_from,
                            'period_to' => $period_to,
                            'units' => $units,
                            'yr_graduated' => $yr_graduated,
                            'ac_ah_recieve' => $ac_ah_recieve
                        ]);
                    }
                }                
            }

            // training_list
            $trainings = $request->training_list;
            if($trainings != NULL) {
                $trainings_query = DB::table('tranings')->where('id', $customer->id)->get();
                if($trainings_query->count()==0) {
                    foreach($trainings as $key => $val) {
                        $title = isset($val['title']) ? $val['title'] : "";
                        $experience = isset($val['experience']) ? $val['experience'] : "";
                        $total_render = isset($val['total_render']) ? $val['total_render'] : "";
                        $date_from = isset($val['date_from']) ? $val['date_from'] : "";
                        $date_to = isset($val['date_to']) ? $val['date_to'] : "";
                        EmployeeTrainings::create([
                            'employee_id' => $customer->id,
                            'title' => $title, 
                            'experience' => $experience,
                            'total_render' => $total_render,
                            'date_from' => $date_from, 
                            'date_to' => $date_to
                        ]);
                    }
                }                
            }




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
        $teacher = DB::table('employee')->where('id', $request->id)->get();
        // $teacher = DB::table('teacher')
        //         ->where('first_name', '=', $request->first_name)
        //         ->orWhere('last_name', '=', $request->last_name)
        //         ->get();

        if($teacher->count()==1) {
            
            $teacher = DB::table('employee')->where('id', $request->id)->update($request->except(['id','contact_list','EB_list','training_list']));
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

             // EB_list
             $eb = $request->EB_list;
             $eb_query = DB::table('education_background')->where('employee_id', $request->id)->get();
             if($eb != NULL) {
                

                if(count($eb)>0) {
                    DB::table('education_background')->where('employee_id', $request->id)->delete();

                    foreach($eb as $key => $val) {
                        $level = isset($val['level']) ? $val['level'] : "";
                        $name_of_school = isset($val['name_of_school']) ? $val['name_of_school'] : "";
                        $basic_edu_degree_course = isset($val['basic_edu_degree_course']) ? $val['basic_edu_degree_course'] : "";
                        $period_from = isset($val['period_from']) ? $val['period_from'] : "";
                        $period_to = isset($val['period_to']) ? $val['period_to'] : "";
                        $units = isset($val['units']) ? $val['units'] : "";
                        $yr_graduated = isset($val['yr_graduated']) ? $val['yr_graduated'] : "";
                        $ac_ah_recieve = isset($val['ac_ah_recieve']) ? $val['ac_ah_recieve'] : "";
                        EmployeeEB::create([
                            'employee_id' => $request->id,
                            'level' => $level, 
                            'name_of_school' => $name_of_school,
                            'basic_edu_degree_course' => $basic_edu_degree_course,
                            'period_from' => $period_from,
                            'period_to' => $period_to,
                            'units' => $units,
                            'yr_graduated' => $yr_graduated,
                            'ac_ah_recieve' => $ac_ah_recieve
                        ]);
                    }
                }
              
             } else if($eb_query->count() > 0 && count($eb) == 0) {
                DB::table('education_background')->where('employee_id', $request->id)->delete();
            }
 
             // training_list
            $trainings = $request->training_list;
            $trainings_query = DB::table('tranings')->where('employee_id', $request->id)->get();
            if($trainings != NULL) {
                $trainings_query = DB::table('tranings')->where('employee_id', $request->id)->get();
                if(count($trainings) > 0) {
                    DB::table('tranings')->where('employee_id', $request->id)->delete();
                    foreach($trainings as $key => $val) {
                        $title = isset($val['title']) ? $val['title'] : "";
                        $experience = isset($val['experience']) ? $val['experience'] : "";
                        $total_render = isset($val['total_render']) ? $val['total_render'] : "";
                        $date_from = isset($val['date_from']) ? $val['date_from'] : "";
                        $date_to = isset($val['date_to']) ? $val['date_to'] : "";
                        EmployeeTrainings::create([
                            'employee_id' => $request->id,
                            'title' => $title, 
                            'experience' => $experience,
                            'total_render' => $total_render,
                            'date_from' => $date_from, 
                            'date_to' => $date_to
                        ]);
                    }
                } else if($trainings_query->count() > 0 && count($trainings) == 0) {
                    DB::table('tranings')->where('employee_id', $request->id)->delete();
                }
            } else if($trainings_query->count() > 0 && count($trainings) == 0) {
                DB::table('tranings')->where('employee_id', $request->id)->delete();
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
        $Student = DB::table('employee')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('employee')->where('id', $request->id)->update(['status'=>'remove']);            
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
