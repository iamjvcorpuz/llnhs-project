<?php

namespace App\Http\Controllers;

use App\Models\Subjects;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public static function getAll()
    {
        return Subjects::all();
    }

}
