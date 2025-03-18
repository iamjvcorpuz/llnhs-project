<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $taskName;
    /**
     * Create a new job instance.
     */
    public function __construct($taskName)
    {
        $this->taskName = $taskName;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
    }
}
