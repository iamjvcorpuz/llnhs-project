<?php

namespace App\Http\Controllers;

use App\Models\Student;
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
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $student
        ], 200);
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
                $customer = Student::create($request->all());
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
}
