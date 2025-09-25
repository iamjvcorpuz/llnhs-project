<?php

namespace App\Http\Controllers;

use App\Models\Holidays;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class HolidaysController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $holidays = DB::select('SELECT *,ROW_NUMBER() OVER () as "index" FROM holidays;');
        return  $holidays;
    }
    public static function getAll()
    {
        $holidays = DB::select('SELECT *,ROW_NUMBER() OVER () as "index" FROM holidays;');
        return  $holidays;
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
            'holidayType' => 'required',
            'event_name' => 'required',
            'date' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('holidays')
                ->Where('event_name', $request->event_name)
                ->get();

        if($advisory->count()==0) {  
            $add = Holidays::create([
                'type' => $request->holidayType,
                'event_name' => $request->event_name,
                'date' => $request->date,
                'time_start' => $request->time_start,
                'time_end' => $request->time_end,
                'description' => $request->description
            ]);

            DB::table('holidays')->where('id', $add->id)->update(['uuid' => $add->id]);
            
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
    public function show(Holidays $holidays)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Holidays $holidays)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [  
            'id' => 'required',
            'holidayType' => 'required',
            'event_name' => 'required',
            'date' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('holidays')
                ->Where('id', $request->id)
                ->get();

        if($advisory->count()==1) {  
            $add = DB::table('holidays')->where('id', $request->id)->update([
                'type' => $request->holidayType,
                'event_name' => $request->event_name,
                'date' => $request->date,
                'time_start' => $request->time_start,
                'time_end' => $request->time_end,
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
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $school_subjects = DB::table('holidays')->where('id', $request->id)->get();
        if($school_subjects->count()==1) {
            $updateStudent = DB::table('holidays')->where('id', $request->id)->delete();
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
