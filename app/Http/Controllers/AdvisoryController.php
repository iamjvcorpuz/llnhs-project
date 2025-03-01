<?php

namespace App\Http\Controllers;

use App\Models\Advisory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdvisoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public static function getAll()
    {
        return Advisory::all();
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
            'qrcode' => 'required|string',
            'teacher_id' => 'required|string',
            'section_name' => 'required|string',
            'year_level' => 'required|string',
            'school_year' => 'required|string',
            'subject_id' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $Student = DB::table('advisory')
                ->where('first_name', '=', $request->first_name)
                ->orWhere('last_name', '=', $request->last_name)
                ->get();

        if($Student->count()==0) {
            $customer = Advisory::create($request->all());
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

    /**
     * Display the specified resource.
     */
    public function show(Advisory $advisory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Advisory $advisory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Advisory $advisory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Advisory $advisory)
    {
        //
    }
}
