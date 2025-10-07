<?php

use App\Jobs\OfflineSyncJob;
use App\Models\Employee;
use App\Models\Parents;
use App\Models\Student;
use App\Models\StudentSync;
use App\Models\UserAccounts;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    $IsKiosk = env('KIOSK', false);
    if($IsKiosk == true) {
        echo "\nExecuted in CONSOLE\n";
        echo "KIOSK MODE ON\n";    
        $UserAccounts = DB::select("SELECT id FROM user_accounts");
        echo "\nUSER ACCOUNTS ";
        echo "LOCAL TOTAL : " . count($UserAccounts) . " :";
        if(count($UserAccounts) == 0) {
            echo "\nCREATING USER ACCOUNTS ";
            OfflineSyncJob::dispatchIfNotExists(UserAccounts::class);
            // OfflineSyncJob::dispatch(UserAccounts::class, 'sync')->onQueue('offline-sync');
        }
        
        $Parents = DB::select("SELECT id FROM parents");
        echo "\nParents ";
        echo "LOCAL TOTAL : " . count($Parents) . " :";
        if(count($Parents) == 0) {
            echo "\nCREATING PARENTS ";
            OfflineSyncJob::dispatchIfNotExists(Parents::class); 
        }

        $Employee = DB::select("SELECT id FROM employee");
        echo "\nEmployee ";
        echo "LOCAL TOTAL : " . count($Employee) . " :";
        if(count($Employee) == 0) {
            echo "\nCREATING EMPLOYEE ";
            OfflineSyncJob::dispatchIfNotExists(Employee::class); 
        }

        $Student = DB::select("SELECT id FROM student");
        echo "\nStudent ";
        echo "LOCAL TOTAL : " . count($Student) . " :";
        if(count($Student) == 0) {
            echo "\nCREATING STUDENT ";
            OfflineSyncJob::dispatchIfNotExists(StudentSync::class); 
        }

        // $Student = DB::select("SELECT id FROM student");
        // echo "\nStudent ";
        // echo "LOCAL TOTAL : " . count($Student) . " :";
        // if(count($Student) == 0) {
        //     echo "\nCREATING USER ACCOUNTS ";
        //     OfflineSyncJob::dispatchIfNotExists(Student::class);
        //     // OfflineSyncJob::dispatch(Parents::class, 'sync')->onQueue('offline-sync');
        // }
    } else {
        echo ",KIOSK MODE OFF";
    }
})->everyTenSeconds()->appendOutputTo(storage_path('logs/cron.log'));

// Schedule::job(function (){
//     // echo "test";
//     Artisan::call('db:sync', ['--remote' => 'mysql_online']);
// })->everySecond()->appendOutputTo(storage_path('logs/cron.log'));
// Schedule::call(function () {
//     // \DB::table('recent_users')->delete();
// })->cron('1 * * * *')->appendOutputTo(storage_path('logs/cron.log'));

Schedule::command('queue:work --queue=offline-sync --stop-when-empty --tries=3 --memory=1056')->everyTenSeconds()->withoutOverlapping()->appendOutputTo(storage_path('logs/cron.log'));