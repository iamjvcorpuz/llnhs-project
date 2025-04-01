<?php

namespace App\Http\Controllers;

use App\Models\Subjects;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public static function getAll()
    {
        $Subjects = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,subject_name,description FROM school_subjects');
        // $student = Student::findOrFail($id);
        //Subjects::all();
        return $Subjects;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [  
            'subject_name' => 'required',
            'description' => 'required', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('school_subjects')
                ->Where('subject_name', $request->subject_name)
                ->get();

        if($advisory->count()==0) {  
            $add = Subjects::create($request->all());
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $add
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA EXIST",
                'data' => []
            ], 200);
        }        
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'subject_name' => 'required',
            'description' => 'required', 
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
        $Student = DB::table('school_subjects')->where('id', $request->id)->get();

        if($Student->count()==1) {
            $customer = DB::table('school_subjects')->where('id', $request->id)->update($request->except(['id']));
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $customer
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT FOUND",
                'data' => []
            ], 200);
        }


    }
    public function remove(Request $request) {
        $school_subjects = DB::table('school_subjects')->where('id', $request->id)->get();
        if($school_subjects->count()==1) {
            // $updateStudent = DB::table('school_subjects')->where('id', $request->id)->update(['status'=>'remove']);
            $updateStudent = DB::table('school_subjects')->where('id', $request->id)->delete();
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
