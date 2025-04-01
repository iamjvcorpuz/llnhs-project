<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralController extends Controller
{
    public static function generateCode()
    {
        $rand_pass = Str::random(10);
        return DB::select('SELECT advisory.id,advisory.qrcode,advisory.teacher_id,advisory.school_sections_id,advisory.section_name,advisory.year_level,advisory.school_year,advisory.subject_id,advisory.description,advisory.status,CONCAT(teacher.last_name , \', \' , teacher.first_name) as teacher_fullname FROM advisory LEFT JOIN teacher ON teacher.id = advisory.teacher_id WHERE advisory.status = \'active\'');
    }
}
