<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentGuardian;
use App\Models\UserAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function index() 
    {
        $student = Student::all();


        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200);
    }
    public static function getAll() 
    {
        return Student::all();
    }

    public static function getCount() 
    {
        return DB::select('SELECT COUNT(*) AS TOTAL FROM student WHERE status = "active" ' );
    }

    public static function getAll_() 
    {
        return Student::all([
            'uuid',
            'id',
            'qr_code',
            'lrn',
            'psa_cert_no',
            'first_name',
            'last_name',
            'middle_name',
            'extension_name',
            'bdate',
            'sex',
            'status',
            'is_ip',
            'ip_specify',
            'is_4ps_benficiary',
            '4ps_id',
            'is_disability',
            'type_disability',
            'type2_disability',
            'type_others_disability', 
            'cd_hno',
            'cd_sn',
            'cd_barangay',
            'cd_mc',
            'cd_province',
            'cd_country',
            'cd_zip', 
            'is_pa_same_cd',
            'pa_hno',
            'pa_sn',
            'pa_barangay',
            'pa_mc',
            'pa_province',
            'pa_country',
            'pa_zip',
            'lglc',
            'lsyc',
            'lsa',
            'lsa_school_id',
            'flsh_semester',
            'flsh_track',
            'flsh_strand',
            'ldm_applied',
        ]);
    }

    public static function getAllActive_() 
    {
        return DB::select("SELECT ROW_NUMBER() OVER () as 'index', 
        'uuid',
        'id',
        'qr_code',
        'lrn',
        'psa_cert_no',
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'bdate',
        'sex',
        'status',
        'is_ip',
        'ip_specify',
        'is_4ps_benficiary',
        '4ps_id',
        'is_disability',
        'type_disability',
        'type2_disability',
        'type_others_disability', 
        'cd_hno',
        'cd_sn',
        'cd_barangay',
        'cd_mc',
        'cd_province',
        'cd_country',
        'cd_zip', 
        'is_pa_same_cd',
        'pa_hno',
        'pa_sn',
        'pa_barangay',
        'pa_mc',
        'pa_province',
        'pa_country',
        'pa_zip',
        'lglc',
        'lsyc',
        'lsa',
        'lsa_school_id',
        'flsh_semester',
        'flsh_track',
        'flsh_strand',
        'ldm_applied'
        FROM student WHERE uuid NOT IN (SELECT 
        student.uuid
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.uuid = advisory_group.advisory_id
        LEFT JOIN student ON student.uuid = advisory_group.student_id
        WHERE advisory_group.status = 'active' AND advisory.status = 'active' )
        ");
    }

    public static function getAllActive__() 
    {
        return DB::select("SELECT ROW_NUMBER() OVER () as 'index', 
        'uuid',
        'id',
        'qr_code',
        'lrn',
        'psa_cert_no',
        'first_name',
        'last_name',
        'middle_name',
        'extension_name',
        'bdate',
        'sex',
        'status',
        'is_ip',
        'ip_specify',
        'is_4ps_benficiary',
        '4ps_id',
        'is_disability',
        'type_disability',
        'type2_disability',
        'type_others_disability', 
        'cd_hno',
        'cd_sn',
        'cd_barangay',
        'cd_mc',
        'cd_province',
        'cd_country',
        'cd_zip', 
        'is_pa_same_cd',
        'pa_hno',
        'pa_sn',
        'pa_barangay',
        'pa_mc',
        'pa_province',
        'pa_country',
        'pa_zip',
        'lglc',
        'lsyc',
        'lsa',
        'lsa_school_id',
        'flsh_semester',
        'flsh_track',
        'flsh_strand',
        'ldm_applied',
        \"\" AS 'picture_base64'
        FROM student WHERE status = 'active' 
        ");
    }
    public static function getAllNonAdvisory($id) 
    {
        return DB::select('SELECT ROW_NUMBER() OVER () as "index", 
        id,
        uuid,
        qr_code,
        lrn, 
        first_name,
        last_name,
        middle_name,
        extension_name, 
        sex,
        status
        FROM student WHERE uuid NOT IN (SELECT 
        student.uuid
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.uuid = advisory_group.advisory_id
        LEFT JOIN student ON student.uuid = advisory_group.student_id
        WHERE advisory_group.status = "active" AND advisory.status = "active" )
        ');
        
    }
    public static function getAllActiveStudent() 
    {
        return DB::select('
        SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        student.qr_code,
        student.uuid,
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track, 
        student.uuid AS student_id,
        student.lrn, 
        student.sex,
        student.psa_cert_no,
        student.bdate,
        student.is_ip,
        student.ip_specify,
        student.is_4ps_benficiary,
        student.4ps_id,
        student.is_disability,
        student.type_disability,
        student.type2_disability,
        student.type_others_disability, 
        student.cd_hno,
        student.cd_sn,
        student.cd_barangay,
        student.cd_mc,
        student.cd_province,
        student.cd_country,
        student.cd_zip,
        student.is_pa_same_cd,
        student.pa_hno,
        student.pa_sn,
        student.pa_barangay,
        student.pa_mc,
        student.pa_province,
        student.pa_country,
        student.pa_zip,
        student.lglc,
        student.lsyc,
        student.lsa,
        student.lsa_school_id,
        student.flsh_semester,
        student.flsh_track,
        student.flsh_strand,
        student.ldm_applied,
        student.status AS \'student_status\',
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.uuid = advisory_group.student_id
        WHERE advisory_group.status = \'active\'');
        
    }

    public static function getAllStudent() 
    {
        $student = DB::select("
        SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        student.qr_code,
        student.uuid,
        CONCAT(student.last_name , ', ' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track, 
        student.uuid AS student_id,
        student.lrn, 
        student.sex,
        student.psa_cert_no,
        student.bdate,
        student.is_ip,
        student.ip_specify,
        student.is_4ps_benficiary,
        student.`4ps_id`,
        student.is_disability,
        student.type_disability,
        student.type2_disability,
        student.type_others_disability, 
        student.cd_hno,
        student.cd_sn,
        student.cd_barangay,
        student.cd_mc,
        student.cd_province,
        student.cd_country,
        student.cd_zip,
        student.is_pa_same_cd,
        student.pa_hno,
        student.pa_sn,
        student.pa_barangay,
        student.pa_mc,
        student.pa_province,
        student.pa_country,
        student.pa_zip,
        student.lglc,
        student.lsyc,
        student.lsa,
        student.lsa_school_id,
        student.flsh_semester,
        student.flsh_track,
        student.flsh_strand,
        student.ldm_applied,
        student.status AS 'student_status',
        student.picture_base64,
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section
        FROM
        student
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id");
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200); 
        
    }

    public static function getAllStudent_() 
    {
        $student = DB::select("
        SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        student.qr_code,
        student.uuid,
        CONCAT(student.last_name , ', ' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track, 
        student.uuid AS student_id,
        student.lrn, 
        student.sex,
        student.psa_cert_no,
        student.bdate,
        student.is_ip,
        student.ip_specify,
        student.is_4ps_benficiary,
        student.`4ps_id`,
        student.is_disability,
        student.type_disability,
        student.type2_disability,
        student.type_others_disability, 
        student.cd_hno,
        student.cd_sn,
        student.cd_barangay,
        student.cd_mc,
        student.cd_province,
        student.cd_country,
        student.cd_zip,
        student.is_pa_same_cd,
        student.pa_hno,
        student.pa_sn,
        student.pa_barangay,
        student.pa_mc,
        student.pa_province,
        student.pa_country,
        student.pa_zip,
        student.lglc,
        student.lsyc,
        student.lsa,
        student.lsa_school_id,
        student.flsh_semester,
        student.flsh_track,
        student.flsh_strand,
        student.ldm_applied,
        student.status AS 'student_status',
        '' AS `picture_base64`,
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section
        FROM
        student
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid  AND advisory_group.status = 'active'
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        WHERE student.status = 'active'");
        return response()->json([
            'status' => 'done',
            'error' => null,
            'data' => $student
        ],200); 
        
    }
    public static function getEnrolledStudent() 
    {
        $student = DB::select('
        SELECT 
        student.qr_code,
        student.uuid,
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track, 
        student.uuid AS student_id,
        student.lrn, 
        student.sex,
        student.psa_cert_no,
        student.bdate,
        student.is_ip,
        student.ip_specify,
        student.is_4ps_benficiary,
        student.4ps_id,
        student.bdate,
        student.is_disability,
        student.type_disability,
        student.type2_disability,
        student.type_others_disability, 
        student.cd_hno,
        student.cd_sn,
        student.cd_barangay,
        student.cd_mc,
        student.cd_province,
        student.cd_country,
        student.cd_zip,
        student.is_pa_same_cd,
        student.pa_hno,
        student.pa_sn,
        student.pa_barangay,
        student.pa_mc,
        student.pa_province,
        student.pa_country,
        student.pa_zip,
        student.lglc,
        student.lsyc,
        student.lsa,
        student.lsa_school_id,
        student.flsh_semester,
        student.flsh_track,
        student.flsh_strand,
        student.ldm_applied,
        student.status AS \'student_status\'
        FROM student
        LEFT JOIN student_movement ON student_movement.student_id = student.uuid
        WHERE student_movement.sy = (SELECT school_year FROM school_registry)');
        return $student;
        // $student = DB::select('
        // SELECT 
        // ROW_NUMBER() OVER () as no,
        // advisory_group.id,
        // student.qr_code,
        // student.uuid,
        // CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        // student.first_name,
        // student.last_name,
        // student.middle_name,
        // student.extension_name,
        // student.flsh_strand,
        // student.flsh_track, 
        // student.uuid AS student_id,
        // student.lrn, 
        // student.sex,
        // student.psa_cert_no,
        // student.bdate,
        // student.is_ip,
        // student.ip_specify,
        // student.is_4ps_benficiary,
        // student.4ps_id,
        // student.bdate,
        // student.is_disability,
        // student.type_disability,
        // student.type2_disability,
        // student.type_others_disability, 
        // student.cd_hno,
        // student.cd_sn,
        // student.cd_barangay,
        // student.cd_mc,
        // student.cd_province,
        // student.cd_country,
        // student.cd_zip,
        // student.is_pa_same_cd,
        // student.pa_hno,
        // student.pa_sn,
        // student.pa_barangay,
        // student.pa_mc,
        // student.pa_province,
        // student.pa_country,
        // student.pa_zip,
        // student.lglc,
        // student.lsyc,
        // student.lsa,
        // student.lsa_school_id,
        // student.flsh_semester,
        // student.flsh_track,
        // student.flsh_strand,
        // student.ldm_applied,
        // student.status AS \'student_status\', 
        // advisory.school_year AS sy,
        // advisory.year_level AS grade,
        // advisory.section_name AS section
        // FROM advisory_group 
        // LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        // LEFT JOIN student ON student.uuid = advisory_group.student_id 
        // LEFT JOIN student_movement ON advisory_group.student_id = student_movement.student_id
        // WHERE student_movement.sy = (SELECT school_year FROM school_registry)');
        // return $student;
        
    }

    public static function getTotalEnrolledStudent() 
    {
        $student = DB::select('
        SELECT 
        COUNT(*)  AS TOTAL
        FROM 
        student_movement
        WHERE sy = (SELECT school_year FROM school_registry)');
        return $student;
        // $total = 0;
        // $student = DB::select("
        // SELECT 
        // advisory.year_level
        // FROM
        // student
        // LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid
        // LEFT JOIN advisory ON  advisory.uuid = advisory_group.advisory_id ");

        // foreach($student as $value) {
        //     if(is_null($value->year_level)){
        //         $total++;
        //     }
        // }

        // return ['TOTAL' => $total];
        
    }

    public static function getTotalUnEnrolledStudent() 
    {
        $student = DB::select('
        SELECT 
        COUNT(*) AS TOTAL
        FROM 
        student_movement
        WHERE sy <> (SELECT school_year FROM school_registry)');
        return $student;
        
    }

    public static function getUnenrolledStudent() 
    {
        $student = DB::select('
        SELECT 
        ROW_NUMBER() OVER () as no,
        advisory_group.id,
        student.qr_code,
        student.uuid,
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track, 
        student.uuid AS student_id,
        student.lrn, 
        student.sex,
        student.psa_cert_no,
        student.bdate,
        student.is_ip,
        student.ip_specify,
        student.is_4ps_benficiary,
        student.4ps_id,
        student.is_disability,
        student.type_disability,
        student.type2_disability,
        student.type_others_disability, 
        student.cd_hno,
        student.cd_sn,
        student.cd_barangay,
        student.cd_mc,
        student.cd_province,
        student.cd_country,
        student.cd_zip,
        student.is_pa_same_cd,
        student.pa_hno,
        student.pa_sn,
        student.pa_barangay,
        student.pa_mc,
        student.pa_province,
        student.pa_country,
        student.pa_zip,
        student.lglc,
        student.lsyc,
        student.lsa,
        student.lsa_school_id,
        student.flsh_semester,
        student.flsh_track,
        student.flsh_strand,
        student.ldm_applied,
        student.status AS \'student_status\', 
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section
        FROM advisory_group 
        LEFT JOIN advisory ON  advisory.id = advisory_group.advisory_id
        LEFT JOIN student ON student.uuid = advisory_group.student_id 
        LEFT JOIN student_movement ON advisory_group.student_id = student_movement.student_id
        WHERE student_movement.sy <> (SELECT school_year FROM school_registry)');
        return $student;
        
    }

    public static function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $student
        ], 200);
    }

    public static function getData($id)
    {
        $student = Student::findOrFail($id);
        return $student;
    }

    public static function getData2($id)
    {
        $student = Student::findOrFail($id,[
            'uuid',
            'id',
            'qr_code',
            'lrn',
            'psa_cert_no',
            'first_name',
            'last_name',
            'middle_name',
            'extension_name',
            'bdate',
            'sex',
            'picture_base64',
            'status'
        ]);
        return $student;
    }

    public static function getDataQR()
    {
        $student = DB::select("
            SELECT 
            uuid,
            id,
            qr_code,
            lrn,
            psa_cert_no,
            first_name,
            last_name,
            middle_name,
            extension_name,
            bdate,
            sex,
            picture_base64,
            status
            FROM
            student
        ");
        return $student;
    }

    public static function getDataQRfilter($qr)
    {
        $student = DB::select("
            SELECT 
            uuid,
            id,
            qr_code,
            lrn,
            psa_cert_no,
            first_name,
            last_name,
            middle_name,
            extension_name,
            bdate,
            sex,
            picture_base64,
            status
            FROM
            student
            WHERE
            qr_code = ?
        ",[$qr]);
        return $student;
    }

    public static function getDataID($id)
    {
        $student = Student::findOrFail($id);
        $guardian = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,CONCAT(last_name , \', \' , first_name) as fullname, qr_code, first_name, last_name, middle_name, extension_name, sex,current_address,(SELECT relationship FROM student_guardians WHERE parents_id = parents.id LIMIT 1) AS \'relationship\', status, picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.id) AS total_student,(SELECT phone_number FROM contacts WHERE guardian_id = parents.id LIMIT 1) as \'phone_number\' FROM parents WHERE id IN (SELECT parents_id FROM student_guardians WHERE student_id = ?) ',[$id]);
        $getSchoolStats = DB::select('SELECT 
        ROW_NUMBER() OVER () as no, 
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.picture_base64 AS photo,
        student.uuid AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\',
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section,
        school_class.track AS track,
        school_class.strands AS strand,
        school_class.level AS grade_level,
        advisory.teacher_id,
        CONCAT(employee.first_name , \' \' , employee.extension_name , \' \' , employee.last_name , \' \' , employee.extension_name  ) AS \'teacher_name\'
        FROM student 
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid AND advisory_group.status = \'active\' 
        LEFT JOIN advisory ON advisory.id = advisory_group.advisory_id
        LEFT JOIN school_class ON school_class.id = advisory.school_sections_id
        LEFT JOIN employee ON employee.id = advisory.teacher_id
        WHERE
        student.uuid = ?;',[$id]);
        //'secret' => env("VERIFIER_URL","https://tinyurl.com/4v4uxjfj") . '/' . Crypt::encryptString($id)
        return  [
            'secret' => env("VERIFIER_URL","https://tinyurl.com/4v4uxjfj") . '/' . $id,
            'student' => $student,
            'guardian' => $guardian,
            'sy' => "",
            'grade' => "",
            'section' => "",
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand(),
            'getSchoolStats' => $getSchoolStats,
            'school' => SystemSettingsController::getSchoolRegistration()
        ];
    }

    public static function getStudentDataID()
    {
        // $student = Student::all();
        $guardian = DB::select("SELECT ROW_NUMBER() OVER () as 'index',
        parents.id,
        parents.uuid, 
        student_guardians.student_id,
        qr_code, 
        first_name, 
        last_name, 
        middle_name, 
        extension_name, 
        sex,
        current_address,
        (SELECT relationship FROM student_guardians WHERE parents_id = parents.id LIMIT 1) AS 'relationship', 
        status, 
        '' AS 'picture_base64', 
        email, 
        (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.id) AS total_student,
        (SELECT phone_number FROM contacts WHERE guardian_id = parents.id LIMIT 1) as 'phone_number',
        (SELECT messenger_id FROM contacts WHERE guardian_id = parents.id LIMIT 1) as 'facebook_messenger' 
        FROM parents LEFT JOIN student_guardians ON student_guardians.parents_id = parents.uuid
        WHERE 
        student_guardians.student_id IS NOT NULL ");

        $student = DB::select("SELECT 
        ROW_NUMBER() OVER () as no, 
        CONCAT(student.last_name , ', ' , student.first_name) as fullname,
        student.uuid,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        '' AS photo,
        student.uuid AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS 'student_status',
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section,
        school_class.track AS track,
        school_class.strands AS strand,
        school_class.level AS grade_level
        FROM student 
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid AND advisory_group.status = 'active'
        LEFT JOIN advisory ON advisory.id = advisory_group.advisory_id
        LEFT JOIN school_class ON school_class.id = advisory.school_sections_id
        WHERE
        student.status = 'active' AND
        school_class.level IS NOT NULL");
        // student.picture_base64
        return  [
            'student' => $student,
            'guardian' => $guardian,
            'sy' => "",
            'grade' => "",
            'section' => "",
            'track' => ProgramsCurricularController::getTrack(),
            'strand' => ProgramsCurricularController::getStrand()
        ];
    }

    public static function getSchoolStats($id)
    {
        $getSchoolStats = DB::select('SELECT 
        ROW_NUMBER() OVER () as no, 
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.uuid,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.picture_base64 AS photo,
        student.uuid AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\',
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section,
        school_class.track AS track,
        school_class.strands AS strand,
        school_class.level AS grade_level
        FROM student 
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid AND advisory_group.status = \'active\'
        LEFT JOIN advisory ON advisory.id = advisory_group.advisory_id
        LEFT JOIN school_class ON school_class.id = advisory.school_sections_id
        WHERE
        student.uuid = ?;',[$id]);
        return  $getSchoolStats;
    }

    public static function getSchoolStatsQR($id)
    {
        $getSchoolStats = DB::select('SELECT 
        ROW_NUMBER() OVER () as no, 
        CONCAT(student.last_name , \', \' , student.first_name) as fullname,
        student.uuid,
        student.first_name,
        student.last_name,
        student.middle_name,
        student.extension_name,
        student.flsh_strand,
        student.flsh_track,
        student.picture_base64 AS photo,
        student.uuid AS student_id,
        student.lrn,
        student.qr_code,
        student.sex,
        student.status AS \'student_status\',
        advisory.school_year AS sy,
        advisory.year_level AS grade,
        advisory.section_name AS section,
        school_class.track AS track,
        school_class.strands AS strand,
        school_class.level AS grade_level
        FROM student 
        LEFT JOIN advisory_group ON advisory_group.student_id = student.uuid AND advisory_group.status = \'active\'
        LEFT JOIN advisory ON advisory.id = advisory_group.advisory_id
        LEFT JOIN school_class ON school_class.id = advisory.school_sections_id
        WHERE
        student.qr_code = ?;',[$id]);
        return  $getSchoolStats;
    }

    public static function getStudentGuardian($id)
    {
        $student = DB::select('SELECT ROW_NUMBER() OVER () as "index",id,uuid, qr_code, first_name, last_name, middle_name, extension_name, sex,current_address, (SELECT relationship FROM student_guardians WHERE parents_id = parents.uuid LIMIT 1) AS \'relationship\', status, "" AS picture_base64, email, (SELECT COUNT(*) FROM student_guardians WHERE parents_id = parents.uuid) AS total_student,(SELECT phone_number FROM contacts WHERE guardian_id = parents.uuid LIMIT 1) as \'phone_number\' FROM parents WHERE id IN (SELECT parents_id FROM student_guardians WHERE student_id = ?)',[$id]);
        // $student = Student::findOrFail($id);
        return $student;
    }

    public static function getStudentGrade(Request $request)
    {
        // var_dump($request->id);
        $sy = SystemSettingsController::getCurrentSY(); 
        $mygrades = DB::select("SELECT
        school_subjects.id,
        school_subjects.subject_name,
        (SELECT q1 FROM student_final_grades 
            WHERE student_final_grades.student_id 
            AND student_final_grades.status = 'default' 
            AND student_final_grades.sy = ? 
            AND student_final_grades.student_id = ?
            AND student_final_grades.subject_name = school_subjects.subject_name
        ) as 'q1',
        (SELECT q2 FROM student_final_grades 
            WHERE student_final_grades.student_id 
            AND student_final_grades.status = 'default' 
            AND student_final_grades.sy = ? 
            AND student_final_grades.student_id = ?
            AND student_final_grades.subject_name = school_subjects.subject_name
        ) as 'q2',
        (SELECT q3 FROM student_final_grades 
            WHERE student_final_grades.student_id 
            AND student_final_grades.status = 'default' 
            AND student_final_grades.sy = ? 
            AND student_final_grades.student_id = ?
            AND student_final_grades.subject_name = school_subjects.subject_name
        ) as 'q3',
        (SELECT q4 FROM student_final_grades 
            WHERE student_final_grades.student_id 
            AND student_final_grades.status = 'default' 
            AND student_final_grades.sy = ? 
            AND student_final_grades.student_id = ?
            AND student_final_grades.subject_name = school_subjects.subject_name
        ) as 'q4'
        FROM school_subjects",[$sy,$request->id,$sy,$request->id,$sy,$request->id,$sy,$request->id]); 
        return $mygrades;
    }
    
    public static function getQRcode(Request $request) {
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
        description,
        'class' AS 'type',
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('student_id',classrooms_seats_assign.student_id,'qr_code',(SELECT qr_code FROM student WHERE id = classrooms_seats_assign.student_id))) FROM classrooms_seats_assign WHERE classrooms_seats_id = class_teaching.id) AS 'student_list' 
        FROM class_teaching 
        LEFT JOIN school_class ON school_class.id = class_teaching.class_id 
        LEFT JOIN employee ON employee.id = class_teaching.teacher_id
        WHERE school_class.qr_code = ?;",[$request->code]); 
        // print_r($class_teaching);
        if(count($class_teaching) > 0) {
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $class_teaching
            ], 200);
        }

    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lrn' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string'            
        ]);
        // 'parents' => 'required','relationship' => 'required'

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Required Fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $Student = DB::table('student')
            ->where('first_name', '=', $request->first_name)
            ->Where('last_name', '=', $request->last_name)
            ->get();
        $StudentLRN = DB::table('student')
            ->where('lrn', '=', $request->lrn) 
            ->get();

        $fields = [];
        if($Student->count()==0) {
            if($StudentLRN->count()==0) {

                $firstname = $request->first_name;
                $lastname = $request->last_name;
                $parts = explode(" ", $firstname);
                $usernames = "";
                $password = $request->lrn;
                
                foreach($parts as $value) {
                    $usernames= $usernames . $value[0];
                }

                $usernames = $usernames . ucfirst(strtolower($lastname));

                $customer = Student::create($request->except(['parents','relationship'])); 

                DB::table('student')->where('id', $customer->id)->update(['uuid' => $customer->id]);

                $parents = $request->input('parents');
                $relationship = $request->input('relationship');

                $UserAccounts = UserAccounts::create([
                    'user_id' => $customer->id,
                    'user_type' => 'Student',
                    'user_role_id' => 3,
                    'fullname' => $firstname . " " . $lastname,
                    'username' => $usernames,
                    'password' => Hash::make($password),
                    'plainpassword' => $password,
                    'verified' => null
                ]); 
                DB::table('user_accounts')->where('id', $UserAccounts->id)->update(['uuid' => $UserAccounts->id]);

                // UserAccounts::factory()->state([
                //     'user_id' => $customer->id,
                //     'user_type' => 'Student',
                //     'user_role_id' => 3,
                //     'fullname' => $firstname . " " . $lastname,
                //     'username' => $usernames,
                //     'password' => Hash::make($password),
                //     'plainpassword' => $password,
                //     'verified' => null
                // ])->create();

                if($parents != NULL) {
                    StudentGuardian::create([
                        'student_id' => $customer->id,
                        'parents_id' => $parents,
                        'relationship' => $relationship
                    ]);
                }
                
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $customer
                ], 201);
            } else if($StudentLRN->count()==0){
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

    public function update(Request $request) 
    {

        // echo "<pre>";
        // echo $request;
        // echo "</pre>";

        $validator = Validator::make($request->all(), [
            'lrn' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'bdate' => 'required|string',
            'sex' => 'required|string',
            'parents' => 'required',
            'relationship' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Required Fields',
                'errors' => $validator->errors()
            ], 422);
        }

        // $Student = DB::table('student')->where('id', $request->id)->get();
        $Student = DB::table('student')->where('uuid', $request->id)->get();

        $StudentLRN = DB::table('student')->where('lrn', $request->lrn) ->get();

        $StudentParent = DB::table('student_guardians')->where('student_id', $request->id)->Where('parents_id',  $request->parents)->get();

        $StudentParent2 = DB::table('student_guardians')->Where('student_id',  $request->id)->get();

        $fields = [];
        if($Student->count()==1) {
            if($StudentLRN->count()==1) {

                // $customer = Student::update($request->except('parents')); 
                $updateStudent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id','relationship']));

                // $updateStudentParent = DB::table('student')->where('id', $request->id)->update($request->except(['parents','id']));
                // $StudentParent->count() == 0 && 
                if($StudentParent2->count() > 0 ) {

                    DB::table('student_guardians')->where('student_id', $request->id)->delete();
                    
                    StudentGuardian::create([
                        'student_id' => $request->id,//--> consider uuid is used
                        'parents_id' => $request->parents,
                        'relationship' => $request->relationship
                    ]);

                } else if($request->parents != "") {
                    StudentGuardian::create([
                        'student_id' => $request->id,
                        'parents_id' => $request->parents,
                        'relationship' => $request->relationship
                    ]);
                }
                // $parents = $request->input('parents');
                
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $updateStudent
                ], 201);

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

    public function remove(Request $request) 
    {
        $Student = DB::table('student')->where('id', $request->id)->get();
        if($Student->count()==1) {
            $updateStudent = DB::table('student')->where('id', $request->id)->update(['status'=>'remove']);            
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
