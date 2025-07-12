<?php

namespace App\Http\Controllers;

use App\Models\FinalGrade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinalGradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    public static function updateGrade(Request $request)
    {
        // echo $request;

        $sfg = DB::select('SELECT * FROM student_final_grades WHERE sy = ? AND student_id = ? AND subject_id = ? AND status = "default" ',[$request->sy,$request->student_id,$request->class_subject_id]);
        
        if(count($sfg) == 0) {

            FinalGrade::create([
                'grade_level' => $request->grade,
                'sy' => $request->sy,
                'student_id' => $request->student_id,
                'teacher_id' => $request->teacher_id,
                'class_id' => $request->class_id,
                'subject_id' => $request->class_subject_id, 
                'subject_name' => $request->class_subject,
                $request->q => $request->final_grade,
                'status' => 'default'
            ]);
        } else if(count($sfg) > 0) {

            $q1 = $sfg[0]->q1;
            $q2 = $sfg[0]->q2;
            $q3 = $sfg[0]->q3;
            $q4 = $sfg[0]->q4;
            
            DB::table('student_final_grades')->where('sy', $request->sy)->where('student_id', $request->student_id)->where('subject_id', $request->class_subject_id)->where('status', 'default')->update([ 
                'status' => 'changed'
            ]);
            
            if($request->q == "q1") {
                $q1 = $request->final_grade;
            } else if($request->q == "q2") {
                $q2 = $request->final_grade;
            } else if($request->q == "q3") {
                $q3 = $request->final_grade;
            } else if($request->q == "q4") {
                $q4 = $request->final_grade;
            }

            FinalGrade::create([
                'grade_level' => $request->grade,
                'sy' => $request->sy,
                'student_id' => $request->student_id,
                'teacher_id' => $request->teacher_id,
                'class_id' => $request->class_id,
                'subject_id' => $request->class_subject_id, 
                'subject_name' => $request->class_subject,
                'q1' => $q1,
                'q2' => $q2,
                'q3' => $q3,
                'q4' => $q4,
                'status' => 'default'
            ]);
        }


        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => []
        ], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(FinalGrade $finalGrade)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinalGrade $finalGrade)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinalGrade $finalGrade)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinalGrade $finalGrade)
    {
        //
    }
}
