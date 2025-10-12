<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        // Define your scheduled tasks here, e.g.:
        // $schedule->command('inspire')->everyMinute();
        echo "\m ------------ start schedule ------------\n";
        // Schedule::command('queue:work --queue=offline-sync --stop-when-empty --tries=3 --timeout=300 --memory=1056M')->everyMinute()->then(function() {
        //     echo "------------------------------ Schedule COMMAND ------------------------------";
        // })->withoutOverlapping()->appendOutputTo(storage_path('logs/cron.log'));
        echo "\m ------------ end schedule ------------\n";
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php'); // Loads commands from routes/console.php
    }
}