<?php

namespace App\Http\Controllers;

use App\Models\ClassSubjectTeaching;
use Illuminate\Database\Query\Builder;
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
        class_teaching.id,
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
        //     'saturday',
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
            'section_name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $exist_class = DB::table('class_teaching')
        ->Where('class_id','=', $request->classts)
        ->Where('time_start','=', $request->time_start)
        ->where(function($exist_class) use ($request) {
            if($request->monday) {
                $exist_class->orWhere('monday' , 1);
            }
            if($request->tuesday) {
                $exist_class->orWhere('tuesday' , 1);
            }
            if($request->wednesday) {
                $exist_class->orWhere('wednesday' , 1);
            }
            if($request->thursday) {
                $exist_class->orWhere('thursday' , 1);
            }
            if($request->friday) {
                $exist_class->orWhere('friday' , 1);
            }
            if($request->saturday) {
                $exist_class->orWhere('saturday' , 1);
            }
            if($request->sunday) {
                $exist_class->orWhere('sunday' , 1);
            }
        });
        $exist_class->get(); 
        $advisory = DB::table('class_teaching')
                ->Where('subject_id', $request->subject)
                ->Where('teacher_id', $request->teacher_id)
                ->Where('class_id', $request->classts)
                ->Where('time_start', $request->time_start)
                ->Where('time_end', $request->time_end)
                ->get();


        if($advisory->count() == 0 && $exist_class->count() == 0) {  
            $qr_code = md5($request->subject . $request->teacher_id . $request->classts . $request->subject_name);
            $add = ClassSubjectTeaching::create([
                'qr_code' => $qr_code,
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
        } elseif ($exist_class->count() > 0) {  
            return response()->json([
                'status' => 'confict',
                'error' => null,
                'data' => []
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
            'time_start' => 'required',
            'time_end' => 'required',
            'classts' => 'required',
            'teacher' => 'required',
            'grade' => 'required',
            'yearlevel' => 'required',
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
        $exist_class = DB::table('class_teaching')
        ->Where('class_id','=', $request->classts)
        ->Where('time_start','=', $request->time_start)
        ->where(function($exist_class) use ($request) {
            if($request->monday) {
                $exist_class->orWhere('monday' , 1);
            }
            if($request->tuesday) {
                $exist_class->orWhere('tuesday' , 1);
            }
            if($request->wednesday) {
                $exist_class->orWhere('wednesday' , 1);
            }
            if($request->thursday) {
                $exist_class->orWhere('thursday' , 1);
            }
            if($request->friday) {
                $exist_class->orWhere('friday' , 1);
            }
            if($request->saturday) {
                $exist_class->orWhere('saturday' , 1);
            }
            if($request->sunday) {
                $exist_class->orWhere('sunday' , 1);
            }
        });
        // $exist_class->dumpRawSql(); 
        $exist_class->get(); 
        $exist_class_result = $exist_class->first();

        $advisory = DB::table('class_teaching')
        ->Where('subject_id', $request->subject)
        ->Where('teacher_id', $request->teacher_id)
        ->Where('class_id', $request->classts)
        ->Where('time_start', $request->time_start)
        ->Where('time_end', $request->time_end)
        // ->dumpRawSql()
        ->get();

        // echo "--";
        // print_r($exist_class_result);
        // echo $exist_class_result->class_id;
        // echo "--";
        // echo $advisory->count();
        // echo "--";
        if($advisory->count()==1) {  
            if($exist_class->count() > 0) {
                if($exist_class->count() == 1) {
                    if($exist_class_result->class_id == $request->classts && $exist_class_result->teacher_id == $request->teacher_id && $exist_class_result->subject_id == $request->subject ) {
                        $update = DB::table('class_teaching')->where('id', $request->id)->update([
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
                            'data' => []
                        ], 201);   
                    } else {
                        return response()->json([
                            'status' => 'confict',
                            'error' => null,
                            'data' => []
                        ], 201);   
                    }
                } else {
                    return response()->json([
                        'status' => 'confict',
                        'error' => null,
                        'data' => []
                    ], 201);                    
                }
            } else {
                $update = DB::table('class_teaching')->where('id', $request->id)->update([
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
                    'data' => $update
                ], 201);                
            }

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
        $school_class = DB::table('class_teaching')->where('id', $request->id)->get();
        if($school_class->count()==1) { 
            $school_class = DB::table('class_teaching')->where('id', $request->id)->delete();
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
