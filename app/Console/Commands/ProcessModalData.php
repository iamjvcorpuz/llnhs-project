<?php

namespace App\Console\Commands;

use App\Models\AttendanceSync;
use Illuminate\Console\Command;
use Xslain\OfflineSync;

class ProcessModalData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-attendance-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        // AttendanceSync::all()
        // ->orderBy('uuid')
        // ->chunkById(500, function ($users) use ($syncManager) {
        //     foreach ($users as $user) {
        //         $syncManager->sync($user);
        //     }
        // });
    }
}
