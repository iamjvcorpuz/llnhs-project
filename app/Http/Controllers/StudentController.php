<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentGuardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function index() 
    {
        $student = Student::all();
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200);
    }
    public static function getAll() 
    {
        return Student::all();
    }
    public static function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $student
        ], 200);
    }
    public static function getData($id)
    {
        $student = Student::findOrFail($id);
        return $student;
    }
    public static function getStudentGuardian($id)
    {
        $student = DB::select('SELECT id, qr_code, first_name, last_name, middle_name, extension_name, sex, status, picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.id) AS total_student FROM parents WHERE id IN (SELECT parents_id FROM student_guardians WHERE student_id = ?) ',[$id]);
        // $student = Student::findOrFail($id);
        return $student;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lrn' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $Student = DB::table('student')
            ->where('first_name', '=', $request->first_name)
            ->Where('last_name', '=', $request->last_name)
            ->get();
        $StudentLRN = DB::table('student')
            ->where('lrn', '=', $request->lrn) 
            ->get();

        $fields = [];
        if($Student->count()==0) {
            if($StudentLRN->count()==0) {

                $customer = Student::create($request->except('parents')); 


                $parents = $request->input('parents');

                if($parents != NULL) {
                    StudentGuardian::create([
                        'student_id' => $customer->id,
                        'parents_id' => $parents
                    ]);
                }
                
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $customer
                ], 201);
            } else if($StudentLRN->count()==0){
                if($StudentLRN->count()>0) {
                    $fields[] = (object)['field'=>'lrn']; 
                }
                $fields[] = (object)['field'=>'last_name'];
                $fields[] = (object)['field'=>'first_name']; 
                return response()->json([
                    'status' => 'data_exist',
                    'error' => "DATA EXIST",
                    'data' => $fields
                ], 200);

            } else {  
                $fields[] = (object)['field'=>'lrn']; 
                return response()->json([
                    'status' => 'data_exist',
                    'error' => "DATA EXIST",
                    'data' => $fields
                ], 200);
            }
        } else {
            if($StudentLRN->count()>0) {
                $fields[] = (object)['field'=>'lrn']; 
            }
            $fields[] = (object)['field'=>'last_name'];
            $fields[] = (object)['field'=>'first_name'];
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA EXIST",
                'data' => $fields
            ], 200);
        }


    }
    public function update(Request $request) {
        $validator = Validator::make($request->all(), [
            'lrn' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $Student = DB::table('student')->where('id', $request->id)->get();

        $StudentLRN = DB::table('student')->where('lrn', $request->lrn) ->get();

        $fields = [];
        if($Student->count()==1) {
            if($StudentLRN->count()==1) {

                // $customer = Student::update($request->except('parents')); 
                $updateStudent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id']));
                // $parents = $request->input('parents');

                // StudentGuardian::create([
                //     'student_id' => $customer->id,
                //     'parents_id' => $parents
                // ]);
                
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $updateStudent
                ], 201);
            } else {  
                $fields[] = (object)['field'=>'lrn']; 
                return response()->json([
                    'status' => 'data_exist',
                    'error' => "DATA EXIST",
                    'data' => $fields
                ], 200);
            }
        } else {
            if($StudentLRN->count()>0) {
                $fields[] = (object)['field'=>'lrn']; 
            }
            $fields[] = (object)['field'=>'last_name'];
            $fields[] = (object)['field'=>'first_name'];
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA EXIST",
                'data' => $fields
            ], 200);
        }
    }
    public function remove(Request $request) {
        $Student = DB::table('student')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('student')->where('id', $request->id)->update(['status'=>'remove']);            
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
