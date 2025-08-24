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
    public static function update(Request $request) 
    {

        // echo "<pre>";
        // echo $request;
        // echo "</pre>";

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'lrn' => 'required|string',
            'school_year' => 'required|string',
            'selectedQr' => 'required|string',
            'selectedGradeLevel' => 'required|string',
        ]);
        // 'flsh_semester' => 'required|string',
        // 'flsh_track' => 'required|string',
        // 'flsh_strand' => 'required',
        // 'repeater' => 'required'
        // id: self.state.id,
        // qr_code: self.state.lrn, 
        // school_year: self.state.schoolRegistry.school_year,
        // selectedQr: self.state.selectedQr,
        // selectedGradeLevel: self.state.selectedGradeLevel,
        // flsh_semester: self.state.flsh_semester_,
        // flsh_track: self.state.flsh_track_,
        // flsh_strand: self.state.flsh_strand_
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
        $transfer_grade_level = "";
        $transfer_sy_completed = "";
        $transfer_school_attended = "";
        $transfer_school_id = "";
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
        //         // $customer = Student::update($request->except('parents')); 
        //         $updateStudent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id','relationship']));

        //         // $updateStudentParent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id']));
        //         // $StudentParent->count() == 0 && 
        //         if($StudentParent2->count() > 0 ) {

        //             DB::table('student_guardians')->where('student_id', $request->id)->delete();
                    
        //             StudentGuardian::create([
        //                 'student_id' => $request->id,
        //                 'parents_id' => $request->parents,
        //                 'relationship' => $request->relationship
        //             ]);

        //         } else if($request->parents != "") {
        //             StudentGuardian::create([
        //                 'student_id' => $request->id,
        //                 'parents_id' => $request->parents,
        //                 'relationship' => $request->relationship
        //             ]);
        //         }
        //         // $parents = $request->input('parents');
                
        //         return response()->json([
        //             'status' => 'success',
        //             'error' => null,
        //             'data' => $updateStudent
        //         ], 201);