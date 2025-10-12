<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfilePhotoController extends Controller
{
    public static function getPhoto($type,$id) 
    {
        if($type == "student") {
            $result = DB::table('student')->where('lrn',$id)->get();
            if($result->count() == 0) {
                $result = DB::table('student')->where('uuid',$id)->get();
            }

            if($result->count() > 0) {
                return $result[0]->picture_base64;
            } else {
                return  "";
            }
        } else if($type == "parent") {
            $result = DB::table('parents')->where('uuid',$id)->get();
            if($result->count() > 0) {
                return $result[0]->picture_base64;
            } else {
                return  "";
            }
        } else if($type == "employee") {
            $result = DB::table('employee')->where('uuid',$id)->get();
            if($result->count() > 0) {
                return $result[0]->picture_base64;
            } else {
                return  "";
            }
        }
    }
}
