<?php

namespace App\Http\Controllers;

use App\Models\AssignSeats;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AssignSeatsController extends Controller
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

    /**
     * Display the specified resource.
     */
    public function show(AssignSeats $assignSeats)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssignSeats $assignSeats)
    {
        //
    }
    public static function getAssignClassSeatsOthers($id) {
        $advisory = DB::table('classrooms_seats')
        ->where('class_id',  $id)
        ->get();
        return $advisory;
    }
    public static function getAssignClassSeatAssignedOthers($id) {
        $advisory = DB::table('classrooms_seats_assign')
        ->where('class_id',  $id)
        ->get();
        return $advisory;
    }
    public static function getAssignClassSeats($id) {
        $advisory = DB::table('classrooms_seats')
        ->where('class_teaching_id',  $id)
        ->get();
        return $advisory;
    }
    public static function getTeachersAllStudentClass($id) {
        $students = DB::select('
        SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.id AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\'
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.id = advisory_group.student_id
        WHERE advisory_group.status = \'active\' AND advisory.status = \'active\' AND advisory.school_sections_id = ?
        ',[$id]);
        return $students;
    }
    public static function getStudentAssignedSeats($id) {
        $advisory = DB::table('classrooms_seats_assign')
        ->where('classrooms_seats_id',  $id)
        ->get();
        return $advisory;
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [  
            'id' => 'required',
            'class_id' => 'required',
            'subject_id' => 'required',
            'number_rows' => 'required',
            'number_columns' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $classrooms_seats = DB::table('classrooms_seats')
        ->where('class_teaching_id',  $request->id)
        ->get();
        $student_list = $request->seats;
        // print_r($student_list);
        if($student_list > 0&& $classrooms_seats->count() > 0) {
            DB::table('classrooms_seats_assign')->where('classrooms_seats_id', $request->id)->delete();
        }        
  

        if($classrooms_seats->count() == 0) {
            AssignSeats::create([ 
                'class_teaching_id' => (int)$request->id,
                'class_id' => (int)$request->class_id,
                'subject_id' => (int)$request->subject_id,
                'number_rows' => (int)$request->number_rows, 
                'number_columns' => (int)$request->number_columns, 
                'total_students' => (int)$request->total_students, 
                'description' => ""
            ]);
 
            if($student_list > 0) { 
                foreach($student_list as $key => $val) {
                    DB::table('classrooms_seats_assign')->insert([
                        'classrooms_seats_id' => (int)$request->id,
                        'class_id' => (int)$request->class_id,
                        'student_id' => $val['student_id'],
                        'seat_number' => $val['seat_number']
                    ]);
                }
                
            }

            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 201);
        } else if($classrooms_seats->count() == 1) {
            DB::table('classrooms_seats')->where('class_teaching_id', $request->id)->update([ 
                'number_rows' => (int)$request->number_rows, 
                'number_columns' => (int)$request->number_columns, 
                'total_students' => (int)$request->total_students, 
            ]);

            if($student_list > 0) { 
                foreach($student_list as $key => $val) {
                    DB::table('classrooms_seats_assign')->insert([
                        'classrooms_seats_id' => (int)$request->id,
                        'class_id' => (int)$request->class_id,
                        'student_id' => $val['student_id'],
                        'seat_number' => $val['seat_number']
                    ]);
                }                
            }

            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT EXIST",
                'data' => []
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssignSeats $assignSeats)
    {
        //
    }
}
