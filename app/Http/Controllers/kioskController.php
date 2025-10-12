<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class kioskController extends Controller
{
    public static function GetDetails() {
        
        $connectionManager = app('offline-sync.connection');
        $remote_status = "offline";
        
        if ($connectionManager->isOnline()) {
            $remote_status = "online";
        } else {
            $remote_status = "offline";
        }
        return response()->json([
            'status' => 'success',
            'data' => [
                'remote' => $remote_status ,
                'ip' => ''
            ],
            'message' => '',
            'errors' => null
        ], 200);

    }
}
