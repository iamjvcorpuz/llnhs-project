<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RandomValueController extends Controller
{
    public static function GetRandome($table,$field)
    {

        $rand_pass = Str::random(10);
        do {
            $rand_pass = Str::random(10);
        } while ( !empty(DB::table($table)->where($field, $rand_pass)->first([$field])) );
        return $rand_pass;
    }
}
