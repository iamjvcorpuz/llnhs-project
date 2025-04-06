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
    public static function getDataID($id)
    {
        $student = Student::findOrFail($id);
        $guardian = DB::select('SELECT ROW_NUMBER() OVER () as "index",id, qr_code, first_name, last_name, middle_name, extension_name, sex,current_address,(SELECT relationship FROM student_guardians WHERE parents_id = parents.id LIMIT 1) AS \'relationship\', status, picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.id) AS total_student,(SELECT phone_number FROM contacts WHERE guardian_id = parents.id) as \'phone_number\' FROM parents WHERE id IN (SELECT parents_id FROM student_guardians WHERE student_id = ?) ',[$id]);
        return  [
            'student' => $student,
            'guardian' => $guardian,
            'sy' => "",
            'grade' => "",
            'section' => "",
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand()
        ];
    }
    public static function getStudentGuardian($id)
    {
        $student = DB::select('SELECT ROW_NUMBER() OVER () as "index",id, qr_code, first_name, last_name, middle_name, extension_name, sex,current_address, (SELECT relationship FROM student_guardians WHERE parents_id = parents.id LIMIT 1) AS \'relationship\', status, picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.id) AS total_student,(SELECT phone_number FROM contacts WHERE guardian_id = parents.id) as \'phone_number\' FROM parents WHERE id IN (SELECT parents_id FROM student_guardians WHERE student_id = ?) ',[$id]);
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
            'sex' => 'required|string',
            'parents' => 'required',
            'relationship' => 'required'
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

                $customer = Student::create($request->except(['parents','relationship'])); 


                $parents = $request->input('parents');
                $relationship = $request->input('relationship');

                if($parents != NULL) {
                    StudentGuardian::create([
                        'student_id' => $customer->id,
                        'parents_id' => $parents,
                        'relationship' => $relationship
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

        // echo "<pre>";
        // echo $request;
        // echo "</pre>";

        $validator = Validator::make($request->all(), [
            'lrn' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string',
            'parents' => 'required',
            'relationship' => 'required'
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

        $StudentParent = DB::table('student_guardians')->where('student_id', $request->id)->Where('parents_id',  $request->parents)->get();

        $StudentParent2 = DB::table('student_guardians')->Where('student_id',  $request->id)->get();

        $fields = [];
        if($Student->count()==1) {
            if($StudentLRN->count()==1) {

                // $customer = Student::update($request->except('parents')); 
                $updateStudent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id','relationship']));

                // $updateStudentParent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id']));
                // $StudentParent->count() == 0 && 
                if($StudentParent2->count() > 0 ) {

                    DB::table('student_guardians')->where('student_id', $request->id)->delete();
                    
                    StudentGuardian::create([
                        'student_id' => $request->id,
                        'parents_id' => $request->parents,
                        'relationship' => $request->relationship
                    ]);

                } else if($request->parents != "") {
                    StudentGuardian::create([
                        'student_id' => $request->id,
                        'parents_id' => $request->parents,
                        'relationship' => $request->relationship
                    ]);
                }
                // $parents = $request->input('parents');
                
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
