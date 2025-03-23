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
        return DB::select('SELECT advisory.id,advisory.qrcode,advisory.teacher_id,advisory.school_sections_id,advisory.section_name,advisory.year_level,advisory.school_year,advisory.subject_id,advisory.description,advisory.status,CONCAT(teacher.last_name , \', \' , teacher.first_name) as teacher_fullname FROM advisory LEFT JOIN teacher ON teacher.id = advisory.teacher_id WHERE advisory.status = \'active\'');
    }
    public static function getRequiredAllData()
    {
        return [
            "teacher" => TeacherController::getAll(),
            "advisory" => AdvisoryController::getAll(),
            "subjects" => SubjectController::getAll(),
            "sections" => SchoolSectionController::getAll(),
            "schoolyeargrades" => SchoolYearGradesController::getAll()
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
            'subject_id' => 'required',
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
                ->Where('subject_id', $request->subject_id)
                ->Where('status', 'active')
                ->get();

        if($advisory->count()==0) { 
            $code = RandomValueController::GetRandome('advisory','qrcode');
            $add = Advisory::create([
                'qrcode' => $code,
                'teacher_id' => (int)$request->teacher_id,
                'school_sections_id' => (int)$request->school_sections_id,
                'section_name' => $request->section_name,
                'year_level' => $request->year_level,
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
