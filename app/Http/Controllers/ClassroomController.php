<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $useraccounts = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,room_number,floor_number,building_no,description FROM classrooms;');
        return  $useraccounts;
    }
    public static function getAll()
    {
        $useraccounts = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,room_number,floor_number,building_no,description FROM classrooms;');
        return  $useraccounts;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [  
            'rooom_no' => 'required',
            'floor_no' => 'required',
            'building_no' => 'required',
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
        $advisory = DB::table('classrooms')
                ->Where('room_number', $request->rooom_no)
                ->get();

        if($advisory->count()==0) {  
            $add = Classroom::create([
                'room_number' => $request->rooom_no,
                'floor_number' => $request->floor_no,
                'building_no' => $request->building_no,
                'description' => $request->description
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

    /**
     * Display the specified resource.
     */
    public function show(Classroom $classroom)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classroom $classroom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classroom $classroom)
    {
        $validator = Validator::make($request->all(), [  
            'rooom_no' => 'required',
            'floor_no' => 'required',
            'building_no' => 'required',
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
        $advisory = DB::table('classrooms')
                ->Where('id', $request->id)
                ->get();

        if($advisory->count()==1) {  
            $update = DB::table('classrooms')->where('id', $request->id)->update([
                'room_number' => $request->rooom_no,
                'floor_number' => $request->floor_no,
                'building_no' => $request->building_no,
                'description' => $request->description
            ]);
            // $update = Classroom::create([
            //     'room_number' => $request->rooom_no,
            //     'floor_number' => $request->floor_no,
            //     'building_no' => $request->building_no,
            //     'description' => $request->description
            // ]);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $update
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_exist',
                'error' => "DATA EXIST",
                'data' => []
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classroom $classroom)
    {
        //
    }
    public function remove(Request $request) {
        $school_subjects = DB::table('classrooms')->where('id', $request->id)->get();
        if($school_subjects->count()==1) {
            // $updateStudent = DB::table('school_subjects')->where('id', $request->id)->update(['status'=>'remove']);
            $updateStudent = DB::table('classrooms')->where('id', $request->id)->delete();
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
