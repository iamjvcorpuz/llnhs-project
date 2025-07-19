<?php

namespace App\Http\Controllers;

use App\Models\Advisory;
use App\Models\AdvisoryGroup;
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
        return DB::select('SELECT advisory.id,advisory.qrcode,advisory.teacher_id,advisory.school_sections_id,advisory.section_name,advisory.year_level,advisory.school_year,advisory.subject_id,advisory.description,advisory.status,CONCAT(employee.last_name , \', \' , employee.first_name) as teacher_fullname FROM advisory LEFT JOIN employee ON employee.id = advisory.teacher_id WHERE advisory.status = \'active\'');
    }
    
    public static function getRequiredAllData()
    {
        return [
            "teacher" => EmployeeController::getAllTeacher(),
            "advisory" => AdvisoryController::getAll(),
            "subjects" => SubjectController::getAll(),
            "sections" => SchoolSectionController::getAll(),
            "schoolyeargrades" => SchoolYearGradesController::getAll(),
            "class" => ClassTSController::getAll(),
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand()
        ];
    }
    
    public static function TeachersAllAdvisories($id)
    {
        return  DB::select('
        SELECT 
        advisory.id,
        advisory.qrcode,
        advisory.teacher_id,
        advisory.school_sections_id,
        advisory.section_name,
        advisory.year_level,advisory.school_year,advisory.subject_id,advisory.description,
        advisory.status,CONCAT(employee.last_name , \', \' , employee.first_name) as teacher_fullname ,
        (SELECT 
        COUNT(*)
        FROM advisory_group  
        WHERE advisory_group.status = \'active\' AND advisory_group.advisory_id = advisory.id ) AS total_students
        FROM advisory LEFT JOIN employee ON employee.id = advisory.teacher_id 
        WHERE advisory.status = \'active\' AND teacher_id = ?',[$id]);
    }
    
    public static function TeachersAdvisories($id,$code)
    {
        return  DB::select('SELECT advisory.id,advisory.qrcode,advisory.teacher_id,advisory.school_sections_id,advisory.section_name,advisory.year_level,advisory.school_year,advisory.subject_id,advisory.description,advisory.status,CONCAT(employee.last_name , \', \' , employee.first_name) as teacher_fullname,
            school_class.section_name,
            school_class.strands,
            school_class.track,
            school_class.grade,
            school_class.classroom,
            classrooms.room_number FROM advisory LEFT JOIN employee ON employee.id = advisory.teacher_id LEFT JOIN school_class ON school_class.id = advisory.school_sections_id LEFT JOIN classrooms ON classrooms.id = school_class.classroom WHERE advisory.status = \'active\' AND advisory.teacher_id = ? AND advisory.qrcode = ?',[$id,$code]);
    }
    
    public static function TeachersAdvisoriesStudentsList($id)
    {
        return  DB::select('SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.picture_base64 AS photo,
        student.id AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\'
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.id = advisory_group.student_id
        WHERE advisory_group.status = \'active\' AND advisory.status = \'active\' AND advisory.teacher_id = ?',[$id]);
    }
    
    public static function TeachersAllStudentAdvisories($id)
    {
        return  DB::select('
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
        student.picture_base64 AS photo,
        student.id AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\'
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.id = advisory_group.student_id
        WHERE advisory_group.status = \'active\' AND advisory.status = \'active\' AND advisory_group.advisory_id = ?
        ',[$id]);
    }
    
    public static function TeachersAllStudentAdvisoriesQR($qrcode)
    {
        return  DB::select('
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
        student.picture_base64 AS photo,
        student.id AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\'
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.id = advisory_group.student_id
        WHERE advisory_group.status = \'active\' AND advisory.status = \'active\' AND advisory.qrcode = ?
        ',[$qrcode]);
    }
    
    public static function TeachersAllStudentClass(Request $request)
    {
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
        WHERE advisory_group.status = \'active\' AND advisory.status = \'active\' AND advisory_group.advisory_id = ?
        ',[$request->id]);
        return response()->json([
            'status' => 'success',
            'error' => $request->id,
            'data' => $students
        ], 201);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function addStudentAdvisory(Request $request)
    {
        
        $validator = Validator::make($request->all(), [  
            'advisory_id' => 'required',
            'select_student_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('advisory_group')
                ->where('advisory_id',  $request->advisory_id)
                ->Where('student_id', $request->select_student_id) 
                ->Where('status', 'active')
                ->get();

        if($advisory->count()==0) {  
            $add = AdvisoryGroup::create([ 
                'advisory_id' => (int)$request->advisory_id,
                'student_id' => (int)$request->select_student_id, 
                'description' => "",
                'status' => 'active'
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

    public static function getTeacherClassAdvisory($id)
    {
        return  DB::select("SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        CONCAT(student.last_name , ', ' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.picture_base64 AS photo,
        student.id AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS 'student_status'
        student_final_grades.subject_id,
        student_final_grades.subject_name,
        student_final_grades.sy,
        student_final_grades.grade_level,
        student_final_grades.q1,
        student_final_grades.q2,
        student_final_grades.q3,
        student_final_grades.q4
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.id = advisory_group.student_id
        LEFT JOIN student_final_grades ON student_final_grades.student_id = student.id AND student_final_grades.status = 'default'
        WHERE advisory_group.status = 'active' AND advisory.status = 'active' AND advisory.id = ?",[$id]);
    }
    public function removeStudentAdvisory(Request $request) {
        $Student = DB::table('advisory_group')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('advisory_group')->where('id', $request->id)->update(['status'=>'remove']);            
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

    public static function sf2($id,$month,$qrcode)
    {
        return  DB::select("SELECT * FROM attendance WHERE type = 'student' AND terminal_id LIKE '%class_id%' AND DATE_FORMAT(`date`, '%Y-%m') = ? AND qr_code IN (SELECT student.lrn FROM advisory_group LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id LEFT JOIN student ON student.id = advisory_group.student_id WHERE advisory_group.status = 'active' AND advisory.status = 'active' AND advisory.qrcode = ?);",[$month,$qrcode]);   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // {
        //     "teacher": 2,
        //     "teacher_name": "Jerde, Deonte",
        //     "yearlevel": "2",
        //     "section": "LightSlateGray",
        //     "section_name": "LightSlateGray",
        //     "schoolyear": "2025 - 2026",
        //     "subject": "1"
        // }
        $validator = Validator::make($request->all(), [  
            'teacher_id' => 'required',
            'school_sections_id' => 'required',
            'section_name' => 'required|string',
            'schoolyear' => 'required|string', 
            'year_level' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('advisory')
        ->where('teacher_id',  $request->teacher_id)
        ->Where('school_sections_id', $request->school_sections_id) 
        ->Where('school_year', $request->schoolyear) 
        ->Where('status', 'active')
        ->get();

        $advisory_section_taken = DB::table('advisory')
        ->Where('school_sections_id', $request->school_sections_id)
        ->Where('school_year', $request->schoolyear) 
        ->Where('status', 'active')
        ->get();

        $advisory_teacher = DB::table('advisory')
        ->where('teacher_id',  $request->teacher_id)
        ->Where('status', 'active')
        ->get();

        if($advisory->count()==0 && $advisory_section_taken->count()==0 && $advisory_teacher->count()==0) { 
            $code = RandomValueController::GetRandome('advisory','qrcode');
            $add = Advisory::create([
                'qrcode' => $code,
                'teacher_id' => (int)$request->teacher_id,
                'school_sections_id' => (int)$request->school_sections_id,
                'section_name' => $request->section_name,
                'year_level' => $request->grade,
                'school_year' => $request->schoolyear,
                'subject_id' => (int)$request->subject_id,
                'description' => '',
                'status' => 'active'
            ]);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $add
            ], 201);
        } elseif($advisory_teacher->count() > 0) {  
            return response()->json([
                'status' => 'teacher_taken',
                'error' => null,
                'data' => []
            ], 201);
        } elseif($advisory_section_taken->count() > 0) {  
            return response()->json([
                'status' => 'section_taken',
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
        $validator = Validator::make($request->all(), [  
            'teacher_id' => 'required',
            'school_sections_id' => 'required',
            'section_name' => 'required|string',
            'schoolyear' => 'required|string', 
            'year_level' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // echo $request;
        $advisory = DB::table('advisory')
        ->where('id',  $request->id)
        ->Where('status', 'active')
        ->get();

        $advisory_teacher = DB::table('advisory')
        ->where('id', '!=' ,  $request->id)
        ->where('teacher_id',  $request->teacher_id)
        ->Where('status', 'active')
        ->get();

        $advisory_section_taken = DB::table('advisory')
        ->Where('school_sections_id', $request->school_sections_id)
        ->Where('school_year', $request->schoolyear) 
        ->Where('status', 'active')
        ->get();
        

        if($advisory->count()==1 && $advisory_section_taken->count()==1 && $advisory_teacher->count() == 0) { 
            // $code = RandomValueController::GetRandome('advisory','qrcode');
            // $add = Advisory::create([
            //     'qrcode' => $code,
            //     'teacher_id' => (int)$request->teacher_id,
            //     'school_sections_id' => (int)$request->school_sections_id,
            //     'section_name' => $request->section_name,
            //     'year_level' => $request->grade,
            //     'school_year' => $request->schoolyear,
            //     'subject_id' => (int)$request->subject_id,
            //     'description' => '',
            //     'status' => 'active'
            // ]);
            $update = DB::table('advisory')->where('id', $request->id)->update([
                'teacher_id' => (int)$request->teacher_id,
                'school_sections_id' => (int)$request->school_sections_id,
                'section_name' => $request->section_name,
                'year_level' => $request->grade,
                'school_year' => $request->schoolyear,
                'subject_id' => (int)$request->subject_id,
                'description' => '',
                'status' => 'active'
            ]);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 201);
        } elseif($advisory_teacher->count() > 0) {  
            return response()->json([
                'status' => 'teacher_taken',
                'error' => null,
                'data' => []
            ], 201);
        } elseif($advisory_section_taken->count() > 0) {  
            return response()->json([
                'status' => 'section_taken',
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
    public function destroy(Advisory $advisory)
    {
        //
    }
    public function remove(Request $request) {
        $Student = DB::table('advisory')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('advisory')->where('id', $request->id)->update(['status'=>'remove']);            
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
