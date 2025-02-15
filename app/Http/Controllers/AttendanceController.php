<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    //
    public function findAccount(Request $request) {

        $Student = DB::table('student')
        ->where('qr_code', '=', $request->code)
        ->get();
        $Teacher = DB::table('teacher')
        ->where('qr_code', '=', $request->code)
        ->get();

        if($Student->count()>0) { 
            $Student[0]->type = "student"; 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $Student[0]
            ], 200);
        } else if($Teacher->count()>0) { 
            $Teacher[0]->type = "teacher"; 
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $Teacher[0]
            ], 200);
        } else {
            return response()->json([
                'status' => 'not_found',
                'error' => null,
                'data' => []
            ], 200);
        }
    }
    public function insertTimelogs(Request $request) {
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);
    }
    public function getUserTimelogs(Request $request) {
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);
    }
    public function geTodayTimelogs(Request $request) {
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 200);
    }
}
