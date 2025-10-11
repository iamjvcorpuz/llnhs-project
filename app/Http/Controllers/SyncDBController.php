<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SyncDBController extends Controller
{
    public static function CollectionData(Request $request)
    {
        // Get chunk parameters from client
        $page = (int) $request->get('page', 1);
        $limit = (int) $request->get('limit', 500); // default 500 records per chunk
        $data = [];
        $total = [];
        // Use chunking by offset (simple approach) 
        if($request->model == "attendance") {
            $data = Attendance::orderBy('uuid')
                ->skip(($page - 1) * $limit)
                ->take($limit)
                ->get();
            $total = Attendance::count();            
        }

        $totalPages = ceil($total / $limit);

        return response()->json([
            'page' => $page,
            'limit' => $limit,
            'total_pages' => $totalPages,
            'data' => $data,
        ]);
        
    }
}
