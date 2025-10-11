<?php

namespace App\Jobs;

use App\Models\StudentSync;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessModalData implements ShouldQueue
{
    use Queueable;

    protected $userIds;

    public function __construct(array $userIds)
    {
        $this->userIds = $userIds;
    }

    public function handle(): void
    {
        StudentSync::whereIn('id', $this->userIds)->update(['status' => 'processed']);
    }
}