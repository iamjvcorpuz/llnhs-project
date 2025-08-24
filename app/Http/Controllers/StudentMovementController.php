<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class StudentMovementController extends Controller
{
    public static function getStudentMovement($qrcode) 
    {
        // $datas = [];
        $datas = DB::select("SELECT * FROM student_movement WHERE student_lrn = ?;",[$qrcode]);
        if(count($datas) == 0) {
            $datas = DB::select("SELECT * FROM student_movement WHERE student_id = ?;",[$qrcode]);
        }


        return $datas;
        
    }
    public static function getStudentMovements() 
    {
        // $datas = [];
        // $datas = DB::select("SELECT * FROM student_movement WHERE student_lrn = ?;",[$qrcode]);
        // if(count($datas) == 0) {
        //     $datas = DB::select("SELECT * FROM student_movement WHERE student_id = ?;",[$qrcode]);
        // }
        $dropout = DB::select("SELECT * FROM student_movement WHERE status = 'drop';");
        $transferOut = DB::select("SELECT * FROM student_movement WHERE status = 'transfer_out';");
        $transferIn = DB::select("SELECT * FROM student_movement WHERE transferee = '1';");;


        return [
            'dropout' => $dropout,
            'transferOut' => $transferOut,
            'transferIn' => $transferIn
        ];
        
    }
    public static function DropStudent(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'lrn' => 'required|string'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }


        $StudentLRN = DB::table('student')->where('lrn', $request->lrn) ->get();

        // $StudentMovementSY = DB::table('student_movement')->where('student_lrn', $request->lrn)->where('sy', $request->school_year)->get();
        // $StudentMovementGL = DB::table('student_movement')->where('student_lrn', $request->lrn)->where('grade_level', $request->selectedGradeLevel)->get();

        if($StudentLRN->count()==1) { 
            DB::table('student_movement')->where('student_lrn', $request->lrn)->update(['status'=>'drop']);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'error' => "Internal Error",
                'data' => []
            ], 200);
        }
    }

    public static function MoveStudent(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'lrn' => 'required|string'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }


        $StudentLRN = DB::table('student')->where('lrn', $request->lrn) ->get();

        // $StudentMovementSY = DB::table('student_movement')->where('student_lrn', $request->lrn)->where('sy', $request->school_year)->get();
        // $StudentMovementGL = DB::table('student_movement')->where('student_lrn', $request->lrn)->where('grade_level', $request->selectedGradeLevel)->get();

        if($StudentLRN->count()==1) { 
            DB::table('student_movement')->where('student_lrn', $request->lrn)->update(['status'=>'transfer_out']);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 201);
        } else {
            return response()->json([
                'status' => 'error',
                'error' => "Internal Error",
                'data' => []
            ], 200);
        }
    }

    public static function update(Request $request) 
    {

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'lrn' => 'required|string',
            'school_year' => 'required|string',
            'selectedQr' => 'required|string',
            'selectedGradeLevel' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // $Student = DB::table('student')->where('id', $request->id)->get();

        $StudentLRN = DB::table('student')->where('lrn', $request->lrn) ->get();

        $StudentMovementSY = DB::table('student_movement')->where('student_lrn', $request->lrn)->where('sy', $request->school_year)->get();
        $StudentMovementGL = DB::table('student_movement')->where('student_lrn', $request->lrn)->where('grade_level', $request->selectedGradeLevel)->get();


        $fields = [];
        $track = "N/A";
        $track_id = "N/A";
        $strand = "N/A";
        $strand_id = "N/A";
        $semester_1st = "N/A";
        $semester_2nd = "N/A";
        $movement_status = "";
        $balik_aral = "";
        $balik_aral_date = "";
        $with_lrn = "Yes";
        $transfer_grade_level = $request->elglc;
        $transfer_sy_completed = $request->elsyc;
        $transfer_school_attended = $request->elsa;
        $transfer_school_id = $request->lesa_school_id;
        $transferee = $request->transferee;

        if($StudentLRN->count()==1) {
            if($StudentMovementSY->count()==0) {
                if($StudentMovementGL->count() == 1 && $request->repeater == true) {
                    DB::table('student_movement')->where('student_lrn', $request->lrn)->update(['status'=>'']);
                    StudentMovement::create([
                        'student_id' => $request->id,
                        'student_lrn' => $request->lrn,
                        'sy' => $request->school_year,
                        'grade_level' => $request->selectedGradeLevel,
                        'repeat_grade_level' => $request->repeater,
                        'track' => $track,
                        'track_id' => $track_id,
                        'strand' => $strand,
                        'strand_id' => $strand_id,
                        'semester_1st' => $semester_1st,
                        'semester_2nd' => $semester_2nd,
                        'movement_status' => $movement_status,
                        'transferee' => $transferee,
                        'transfer_grade_level' => $transfer_grade_level,
                        'transfer_sy_completed' => $transfer_sy_completed,
                        'transfer_school_attended' => $transfer_school_attended,
                        'transfer_school_id' => $transfer_school_id,
                        'balik_aral' => $balik_aral,
                        'balik_aral_date' => $balik_aral_date,
                        'with_lrn' => $with_lrn,
                        'status' => "active"
                    ]);

                    return response()->json([
                        'status' => 'success',
                        'error' => null,
                        'data' => []
                    ], 201);

                } else if($StudentMovementGL->count() == 1 && $request->repeater == false) {

                    $fields[] = (object)['grade'=>'already_taken']; 
                    return response()->json([
                        'status' => 'data_exist',
                        'error' => "DATA EXIST",
                        'data' => $fields
                    ], 200);

                } else {

                    DB::table('student_movement')->where('student_lrn', $request->lrn)->update(['status'=>'']);
                    StudentMovement::create([
                        'student_id' => $request->id,
                        'student_lrn' => $request->lrn,
                        'sy' => $request->school_year,
                        'grade_level' => $request->selectedGradeLevel,
                        'repeat_grade_level' => $request->repeater,
                        'track' => $track,
                        'track_id' => $track_id,
                        'strand' => $strand,
                        'strand_id' => $strand_id,
                        'semester_1st' => $semester_1st,
                        'semester_2nd' => $semester_2nd,
                        'transferee' => $transferee,
                        'transfer_grade_level' => $transfer_grade_level,
                        'transfer_sy_completed' => $transfer_sy_completed,
                        'transfer_school_attended' => $transfer_school_attended,
                        'transfer_school_id' => $transfer_school_id,
                        'movement_status' => $movement_status,
                        'balik_aral' => $balik_aral,
                        'balik_aral_date' => $balik_aral_date,
                        'with_lrn' => $with_lrn,
                        'status' => "active"
                    ]);

                    return response()->json([
                        'status' => 'success',
                        'error' => null,
                        'data' => []
                    ], 201);

                }
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