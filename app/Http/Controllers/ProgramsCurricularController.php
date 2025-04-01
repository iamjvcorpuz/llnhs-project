<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProgramsCurricularController extends Controller
{
    public static function getTrack()
    {
        $Subjects = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,name,acronyms,definition,description FROM specific_programs');
        // $student = Student::findOrFail($id);
        //Subjects::all();
        return $Subjects;
    }
    public static function getStrand()
    {
        $Subjects = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,name,acronyms,definition,description FROM specialize_program');
        // $student = Student::findOrFail($id);
        //Subjects::all();
        return $Subjects;
    }
    
    public static function getAll()
    {
        $specific_programs = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,name,acronyms,definition,description FROM specific_programs');
        $specialize_program = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,name,acronyms,definition,description FROM specialize_program');
        // $student = Student::findOrFail($id);
        //Subjects::all();
        return [
           'track' => $specific_programs,
           'strand' => $specialize_program
        ];
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [  
            'name' => 'required',
            'type' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        if($request->type=="track") {
            $specific_programs = DB::table('specific_programs')->Where('name', $request->name)->get();
            if($specific_programs->count()==0) {  
                $add = DB::table('specific_programs')->insert([
                    'name' => $request->name, 
                    'acronyms' => $request->acronym, 
                    'definition' => '', 
                    'description' => $request->description,
                    "created_at" =>  \Carbon\Carbon::now(),
                    "updated_at" => \Carbon\Carbon::now()
                ]);
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
        } else if($request->type=="strand") {
            $specific_programs = DB::table('specialize_program')->Where('name', $request->name)->get();
            if($specific_programs->count()==0) {  
                $add = DB::table('specialize_program')->insert([
                    'name' => $request->name, 
                    'acronyms' => $request->acronym, 
                    'definition' => '', 
                    'description' => $request->description,
                    "created_at" =>  \Carbon\Carbon::now(),
                    "updated_at" => \Carbon\Carbon::now()
                ]);
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

     
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [  
            'id' => 'required',
            'name' => 'required',
            'type' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        if($request->type=="track") {
            $specific_programs = DB::table('specific_programs')->Where('id', $request->id)->get();
            if($specific_programs->count()==1) {  
                $add = DB::table('specific_programs')->where('id', $request->id)->update([
                    'name' => $request->name, 
                    'acronyms' => $request->acronym, 
                    'definition' => '', 
                    'description' => $request->description,
                    "created_at" =>  \Carbon\Carbon::now(),
                    "updated_at" => \Carbon\Carbon::now()
                ]);
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
        } else if($request->type=="strand") {
            $specific_programs = DB::table('specialize_program')->Where('id', $request->id)->get();
            if($specific_programs->count()==1) {  
                $add = DB::table('specialize_program')->where('id', $request->id)->update([
                    'name' => $request->name, 
                    'acronyms' => $request->acronym, 
                    'definition' => '', 
                    'description' => $request->description,
                    "created_at" =>  \Carbon\Carbon::now(),
                    "updated_at" => \Carbon\Carbon::now()
                ]);
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

     
    }
    public function remove(Request $request) {
        if($request->type=="track") {
            $specific_programs = DB::table('specific_programs')->where('id', $request->id)->get();
            if($specific_programs->count()==1) {
                // $updateStudent = DB::table('school_subjects')->where('id', $request->id)->update(['status'=>'remove']);
                $updatespecific_programs = DB::table('specific_programs')->where('id', $request->id)->delete();
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $updatespecific_programs
                ], 201);
            } else {
                return response()->json([
                    'status' => 'data_not_exist',
                    'error' => "DATA NOT FOUND",
                    'data' => []
                ], 200);
            }
        } else if($request->type=="strand") {
            $specialize_program = DB::table('specialize_program')->where('id', $request->id)->get();
            if($specialize_program->count()==1) {
                // $updateStudent = DB::table('school_subjects')->where('id', $request->id)->update(['status'=>'remove']);
                $updatespecialize_program = DB::table('specialize_program')->where('id', $request->id)->delete();
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $updatespecialize_program
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
}
