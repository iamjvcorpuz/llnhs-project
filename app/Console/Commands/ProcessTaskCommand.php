<?php

namespace App\Console\Commands;

use App\Http\Controllers\SMSController;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class ProcessTaskCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-task-command';

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
        // SMSController::_SendSMS();
    }
}
