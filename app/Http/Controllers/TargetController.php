<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TargetController extends Controller
{
    public function process(Request $request)
    {
        // print_r($request->all());
        return response()->json($request->all());
    }
}
