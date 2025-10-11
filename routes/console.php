<?php

use App\Jobs\OfflineSyncJob;
use App\Models\AttendanceSync;
use App\Models\Employee;
use App\Models\EmployeeSync;
use App\Models\Parents;
use App\Models\ParentsSync;
use App\Models\Student;
use App\Models\StudentSync;
use App\Models\UserAccounts;
use App\Models\UserAccountsSync;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;


Schedule::call(function () {
    $IsKiosk = env('KIOSK', false); 
    if($IsKiosk == true) { 
        OfflineSyncJob::dispatchIfNotExists(AttendanceSync::class); 
    } else {
        echo ",KIOSK MODE OFF";
    }
})->everyTenSeconds()->appendOutputTo(storage_path('logs/cron.log'));

// Schedule::call(function () {

//     OfflineSyncJob::dispatchIfNotExists(AttendanceSync::class); 
    
//     $IsKiosk = env('KIOSK', false);
//     $busy = false;
//     if($IsKiosk == true && $busy == false) {
//         echo "\nExecuted in CONSOLE\n";
//         echo "KIOSK MODE ON\n";    
//         $UserAccounts = DB::select("SELECT id FROM user_accounts");
//         echo "\nUSER ACCOUNTS ";
//         echo "LOCAL TOTAL : " . count($UserAccounts) . " :";
//         if(count($UserAccounts) == 0) {
//             $busy = true;
//             echo "\nCREATING USER ACCOUNTS ";
//             OfflineSyncJob::dispatchIfNotExists(UserAccountsSync::class);
//             // OfflineSyncJob::dispatch(UserAccounts::class, 'sync')->onQueue('offline-sync');
//         }
        
//         $Parents = DB::select("SELECT id FROM parents");
//         echo "\nParents ";
//         echo "LOCAL TOTAL : " . count($Parents) . " :";
//         if(count($Parents) == 0) {
//             echo "\nCREATING PARENTS ";
//             $busy = true;
//             OfflineSyncJob::dispatchIfNotExists(ParentsSync::class); 
//         }

//         $Employee = DB::select("SELECT id FROM employee");
//         echo "\nEmployee ";
//         echo "LOCAL TOTAL : " . count($Employee) . " :";
//         if(count($Employee) == 0) {
//             echo "\nCREATING EMPLOYEE ";
//             $busy = true;
//             OfflineSyncJob::dispatchIfNotExists(EmployeeSync::class); 
//         }

//         $Student = DB::select("SELECT id FROM student");
//         echo "\nStudent ";
//         echo "LOCAL TOTAL : " . count($Student) . " :";
//         if(count($Student) == 0) {
//             echo "\nCREATING STUDENT ";
//             $busy = true;
//             OfflineSyncJob::dispatchIfNotExists(StudentSync::class); 
//         }

        
//     } else {
//         echo ",KIOSK MODE OFF";
//     }
// })->everyTenSeconds()->appendOutputTo(storage_path('logs/cron.log'));


// Schedule::command('queue:work --queue=offline-sync --stop-when-empty --tries=3 --memory=1gb --timeout=300')->everyTenSeconds()->withoutOverlapping()->appendOutputTo(storage_path('logs/cron.log'));
Schedule::command('queue:work --queue=offline-sync --stop-when-empty --memory=1056')->everyTenSeconds()->withoutOverlapping()->appendOutputTo(storage_path('logs/cron.log'));