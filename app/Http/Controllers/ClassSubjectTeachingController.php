<?php

namespace App\Http\Controllers;

use App\Models\ClassSubjectTeaching;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClassSubjectTeachingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class;');
        return  $school_class;
    }
    public static function getAll()
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class;');
        return  $school_class;
    }
    public static function getAll2()
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class;');
        $class_teaching = DB::select("SELECT ROW_NUMBER() OVER () as 'index',
        subject_id,
        teacher_id,
        class_id,
        CONCAT(employee.last_name , ', ' , employee.first_name) AS 'teacher_name',
        school_class.section_name ,
        school_class.track,
        school_class.strands,
        school_class.level,
        school_class.classroom AS 'classroom_number',
        subject_name,
        time_start,
        time_end,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        description
        FROM class_teaching 
        LEFT JOIN school_class ON school_class.id = class_teaching.class_id 
        LEFT JOIN employee ON employee.id = class_teaching.teacher_id ;");
        // return  $school_class;
        return [
            "class_teaching" => $class_teaching,
            "class" => $school_class,
            "classroom" => ClassroomController::getAll(),
            "advisory" => AdvisoryController::getAll(),
            "teacher" => EmployeeController::getAllTeacher(),
            "subjects" => SubjectController::getAll(),
            "sections" => SchoolSectionController::getAll(),
            "schoolyeargrades" => SchoolYearGradesController::getAll(),
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand()
        ];
    }
    public static function getAllTeacherClass($id)
    {
        $school_class = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,level,grade as grade_id,section_name,(SELECT year_grade FROM school_year_grades WHERE id = school_class.grade) AS \'grade\',track,strands,classroom as classroom_id,(SELECT room_number FROM classrooms WHERE classrooms.id = school_class.classroom ) AS \'classroom\',school_year FROM school_class;');
        $class_teaching = DB::select("SELECT ROW_NUMBER() OVER () as 'index',
        subject_id,
        teacher_id,
        class_id,
        CONCAT(employee.last_name , ', ' , employee.first_name) AS 'teacher_name',
        school_class.section_name ,
        school_class.track,
        school_class.strands,
        school_class.level,
        school_class.classroom AS 'classroom_number',
        subject_name,
        time_start,
        time_end,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        description
        FROM class_teaching 
        LEFT JOIN school_class ON school_class.id = class_teaching.class_id 
        LEFT JOIN employee ON employee.id = class_teaching.teacher_id
        WHERE class_teaching.teacher_id = ?;",[$id]);
        // return  $school_class;
        return [
            "class_teaching" => $class_teaching,
            "class" => $school_class,
            "classroom" => ClassroomController::getAll(),
            "advisory" => AdvisoryController::getAll(),
            "teacher" => EmployeeController::getAllTeacher(),
            "subjects" => SubjectController::getAll(),
            "sections" => SchoolSectionController::getAll(),
            "schoolyeargrades" => SchoolYearGradesController::getAll(),
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand()
        ];
    }
    public static function getAllTeacherClassTeaching($id)
    {
        $class_teaching = DB::select("SELECT ROW_NUMBER() OVER () as 'index',
        subject_id,
        teacher_id,
        class_id,
        CONCAT(employee.last_name , ', ' , employee.first_name) AS 'teacher_name',
        school_class.section_name ,
        school_class.track,
        school_class.strands,
        school_class.level,
        school_class.classroom AS 'classroom_number',
        subject_name,
        time_start,
        time_end,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        description
        FROM class_teaching 
        LEFT JOIN school_class ON school_class.id = class_teaching.class_id 
        LEFT JOIN employee ON employee.id = class_teaching.teacher_id
        WHERE class_teaching.teacher_id = ?;",[$id]); 
        return $class_teaching;
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
        // protected $fillable = [
        //     'subject_id',
        //     'teacher_id',
        //     'class_id',
        //     'subject_name',
        //     'time_start',
        //     'time_end',
        //     'monday',
        //     'tuesday',
        //     'wednesday',
        //     'thursday',
        //     'friday',
        //     'staturday',
        //     'sunday',
        //     'description'
        // ];
        $validator = Validator::make($request->all(), [  
            'time_start' => 'required',
            'time_end' => 'required',
            'classts' => 'required',
            'teacher' => 'required',
            'grade' => 'required',
            'yearlevel' => 'required',
            'schoolyear' => 'required', 
            'flsh_track' => 'required', 
            'flsh_strand' => 'required',
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
        $advisory = DB::table('class_teaching')
                ->Where('subject_id', $request->subject)
                ->Where('teacher_id', $request->teacher)
                ->Where('class_id', $request->classts)
                ->Where('time_start', $request->time_start)
                ->Where('time_end', $request->time_end)
                ->get();

        if($advisory->count()==0) {  
            $add = ClassSubjectTeaching::create([
                'subject_id' => $request->subject,
                'teacher_id' => $request->teacher_id,
                'class_id' => $request->classts,
                'subject_name' => $request->subject_name,
                'time_start' => $request->time_start,
                'time_end' => $request->time_end,
                'monday' => $request->monday,
                'tuesday' => $request->tuesday,
                'wednesday' => $request->wednesday,
                'thursday' => $request->thursday,
                'friday' => $request->friday,
                'saturday' => $request->saturday,
                'sunday' => $request->sunday,
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
    public function show(ClassSubjectTeaching $classSubjectTeaching)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassSubjectTeaching $classSubjectTeaching)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClassSubjectTeaching $classSubjectTeaching)
    {
        $validator = Validator::make($request->all(), [  
            'id' => 'required',
            'grade' => 'required',
            'yearlevel' => 'required',
            'classroom' => 'required',
            'schoolyear' => 'required', 
            'flsh_track' => 'required', 
            'flsh_strand' => 'required',
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
