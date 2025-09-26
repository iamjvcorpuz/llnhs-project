<?php

namespace App\Http\Controllers;

use App\Models\ClassTS;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
class ClassTSController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",uuid,id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class ORDER By school_class.created_at DESC;');
        return  $school_class;
    }
    public static function getAll()
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",uuid,qr_code,id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class ORDER By school_class.created_at DESC;');
        return  $school_class;
    }

    public static function getAllSchedules($id)
    {
        $school_class = DB::select("
        SELECT 
        * 
        FROM 
        school_class 
        LEFT JOIN class_teaching ON class_teaching.class_id = school_class.uuid
        LEFT JOIN school_subjects ON school_subjects.id = class_teaching.subject_id
        LEFT JOIN employee ON employee.uuid = class_teaching.teacher_id
        WHERE
        school_class.qr_code = ?
        ;",[$id]);
        return  $school_class;
    }

    public static function getClassDetails($id)
    {
        $school_class = DB::select("
        SELECT 
        * 
        FROM
        school_class
        WHERE
        school_class.qr_code = ?
        ;",[$id]);
        return  $school_class;
    }


    public static function getAll2()
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",qr_code,id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class ORDER By school_class.created_at DESC;');
        // return  $school_class;
        return [
            "class" => $school_class,
            "classroom" => ClassroomController::getAll(),
            "advisory" => AdvisoryController::getAll(),
            "subjects" => SubjectController::getAll(),
            "sections" => SchoolSectionController::getAll(),
            "schoolyeargrades" => SchoolYearGradesController::getAll(),
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand()
        ];
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
            'grade' => 'required',
            'yearlevel' => 'required',
            'classroom' => 'required',
            'schoolyear' => 'required',
            'section_name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('school_class')
                ->Where('level', $request->yearlevel)
                ->Where('grade', $request->grade)
                ->Where('track', $request->flsh_track)
                ->Where('strands', $request->flsh_strand)
                ->Where('classroom', $request->classroom)
                ->Where('section_name', $request->section_name)
                ->get();
        $qr_code = md5($request->yearlevel . $request->grade . $request->classroom . $request->schoolyear . $request->section_name);
        if($advisory->count()==0) {  
            $add = ClassTS::create([
                'qr_code' => $qr_code,
                'level' => $request->yearlevel,
                'grade' => $request->grade,
                'track' => $request->flsh_track,
                'strands' => $request->flsh_strand,
                'classroom' => $request->classroom,
                'school_year' => $request->schoolyear,
                'section_name' => $request->section_name
            ]);
            DB::table('school_class')->where('id', $add->id)->update(['uuid' => $add->id]);
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
    public function show(ClassTS $classTS)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassTS $classTS)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClassTS $classTS)
    {
        $validator = Validator::make($request->all(), [  
            'id' => 'required',
            'grade' => 'required',
            'yearlevel' => 'required',
            'classroom' => 'required',
            'schoolyear' => 'required', 
            'section_name' => 'required'
        ]);

        // 'flsh_track' => 'string', 
        // 'flsh_strand' => 'string',
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('school_class')
                ->Where('id', $request->id)
                ->get();

        if($advisory->count()==1) {  
            $update = DB::table('school_class')->where('id', $request->id)->update([
                'level' => $request->yearlevel,
                'grade' => $request->grade,
                'track' => $request->flsh_track,
                'strands' => $request->flsh_strand,
                'classroom' => $request->classroom,
                'school_year' => $request->schoolyear,
                'section_name' => $request->section_name
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
    public function destroy(Request $request)
    {
        $school_class = DB::table('school_class')->where('id', $request->id)->get();
        if($school_class->count()==1) { 
            $school_class = DB::table('school_class')->where('id', $request->id)->delete();
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $school_class
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
