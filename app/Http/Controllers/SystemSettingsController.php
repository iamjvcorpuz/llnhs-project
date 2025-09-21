<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


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
    public static function geSystemSettings()
    {
        $sy = DB::table("system_settings")->get();
        if(count($sy)>0){
            return $sy;
        } else {
            return [];
        }
    }
    public static function update(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'school_name' => 'required',
            'school_id' => 'required', 
            'school_address' => 'required', 
            'school_district' => 'required', 
            'school_division' => 'required', 
            'school_region' => 'required', 
            'school_head_teacher' => 'required', 
            'school_head_teacher_position' => 'required', 
            'school_sy' => 'required', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        // // echo $request;
        $school_registry = DB::table('school_registry')->get();

        if($school_registry->count()==1) {
            $school_registry = DB::table('school_registry')->update([
                'school_name' => $request->school_name,
                'school_id' => $request->school_id,
                'school_address' => $request->school_address,
                'district' => $request->school_district,
                'division' => $request->school_division,
                'region' => $request->school_region,
                'head_name' => $request->school_head_teacher,
                'head_position' => $request->school_head_teacher_position,
                'school_year' => $request->school_sy,
            ]);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $request->all()
            ], 201);
        } else if($school_registry->count()==0) {
            $school_registry = DB::table('school_registry')->insert([
                'school_name' => $request->school_name,
                'school_id' => $request->school_id,
                'school_address' => $request->school_address,
                'district' => $request->school_district,
                'division' => $request->school_division,
                'region' => $request->school_region,
                'head_name' => $request->school_head_teacher,
                'head_position' => $request->school_head_teacher_position,
                'school_year' => $request->school_sy,
            ]);
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $request->all()
            ], 201);
        } else {
            return response()->json([
                'status' => 'data_not_exist',
                'error' => "DATA NOT FOUND",
                'data' => []
            ], 200);
        }


    }

    public static function systemSettingsUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'enable_sms' => 'required',
            'enable_fb' => 'required', 
            'sms_present' => 'required', 
            'sms_absent' => 'required', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        // // echo $request;
        $enable_sms_q = DB::table('system_settings')->where('setting','ENABLE_SMS')->get();
        $enable_fb_q = DB::table('system_settings')->where('setting','ENABLE_FB_MESSENGER')->get();
        $sms_present_q = DB::table('system_settings')->where('setting','ATTENDANCE_CLASS_STUDENT_PRESENT')->get();
        $sms_absent_q = DB::table('system_settings')->where('setting','ATTENDANCE_CLASS_STUDENT_ABSENT')->get();

        if($enable_sms_q->count()>0&&$enable_fb_q->count()>0&&$sms_present_q->count()>0&&$sms_absent_q->count()>0) {

            DB::table('system_settings')->where('setting','ENABLE_SMS')->update(['value' => $request->enable_sms]);
            DB::table('system_settings')->where('setting','ENABLE_FB_MESSENGER')->update(['value' => $request->enable_fb]);
            DB::table('system_settings')->where('setting','ATTENDANCE_CLASS_STUDENT_PRESENT')->update(['value' => $request->sms_present]);
            DB::table('system_settings')->where('setting','ATTENDANCE_CLASS_STUDENT_ABSENT')->update(['value' => $request->sms_absent]);

            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => $request->all()
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
