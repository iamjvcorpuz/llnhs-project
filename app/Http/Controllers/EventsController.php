<?php

namespace App\Http\Controllers;

use App\Models\Events;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EventsController extends Controller
{
        /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = DB::select('SELECT *,ROW_NUMBER() OVER () as "index" FROM events;');
        return  $events;
    }
    public static function getAll()
    {
        $events = DB::select('SELECT *,ROW_NUMBER() OVER () as "index" FROM events;');
        return  $events;
    }
    public static function getAllActive()
    {
        $events = DB::select('SELECT *,ROW_NUMBER() OVER () as "index" FROM events WHERE `date` = DATE_FORMAT(CURDATE(), \'%Y-%m-%d\');');
        return  $events;
    }

    public static function getEvent($id)
    {
        $events = DB::select('SELECT *,ROW_NUMBER() OVER () as "index" FROM events WHERE  id = ?;',[$id]);
        return  $events;
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
        $advisory = DB::table('events')
                ->Where('event_name', $request->event_name)
                ->get();

        $qr_code = md5($request->holidayType . $request->event_name . $request->date . $request->time_start . $request->time_end);
        if($advisory->count()==0) { 
            
            $add = Events::create([
                'qrcode' => $qr_code,
                'facilitator' => $request->facilitator,
                'type' => $request->holidayType,
                'event_name' => $request->event_name,
                'date' => $request->date,
                'time_start' => $request->time_start,
                'time_end' => $request->time_end,
                'description' => $request->description
            ]);

            DB::table('events')->where('id', $add->id)->update(['uuid' => $add->id]);

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
    public function show(Events $holidays)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Events $holidays)
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
        $advisory = DB::table('events')
                ->Where('id', $request->id)
                ->get();

        if($advisory->count()==1) {  
            $add = DB::table('events')->where('id', $request->id)->update([
                'facilitator' => $request->facilitator,
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
        $school_subjects = DB::table('events')->where('id', $request->id)->get();
        if($school_subjects->count()==1) {
            $updateStudent = DB::table('events')->where('id', $request->id)->delete();
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
