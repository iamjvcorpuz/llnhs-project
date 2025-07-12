<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemSettingsController extends Controller
{
    public static function getCurrentSY()
    {
        $sy = DB::table("system_settings")->where('setting', 'SCHOOL_YEAR')->get();
        if(count($sy)>0){
            return $sy[0]->value;
        } else {
            return "";
        }
    }
    public static function getSchoolRegistration()
    {
        $sy = DB::table("school_registry")->get();
        if(count($sy)>0){
            return $sy[0];
        } else {
            return "";
        }
    }
}
