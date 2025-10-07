<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
// use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class OfflineSyncJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3; // Retry up to 3 times on failure
    public $backoff = [10, 30, 60]; // Exponential backoff in seconds
    public $timeout = 60;
    protected $modelClass;
    protected $syncType; // 'push', 'pull', or 'sync
    public $userId;
    protected $uniqueId;
    /**
     * Create a new job instance.
     */
    public function __construct(?string $modelClass = null, string $syncType = 'sync')
    {
        $this->modelClass = $modelClass;
        $this->syncType = $syncType;
        $this->userId = $modelClass;
        $this->uniqueId = md5("process_user_task_{$modelClass}"); // Unique hash
        $this->onQueue('offline-sync');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // set_time_limit(160);
        $IsKiosk =  env('KIOSK', false);
        if($IsKiosk==true) { 
            try {
                // ini_set('memory_limit', '512M');
                $command = 'offline-sync:' . $this->syncType;
                $options = $this->modelClass ? ['--model' => $this->modelClass] : [];
                // $options = $this->modelClass ? ['--model' => $this->modelClass, '--timeout' => 30,'--once' => true] : [];                
                Artisan::call($command, $options);
                $output = Artisan::output(); 
                Log::info('Offline sync processed: ' . $output);
            } catch (\Exception $e) {
                echo "Error: " . $e->getMessage();
                Log::error('Offline sync failed: ' . $e->getMessage());
                throw $e;  // Retry
            }
        } else {
            echo "\nsFailed to start. APP IS NOT A KIOSK MODE";
        }
    }   
    public static function dispatchIfNotExists(?string $userId)
    {
        $uniqueId = md5("process_user_task_{$userId}");
        // Check if job exists in the queue
        $exists = DB::table('jobs')
            ->where('queue', 'offline-sync')
            ->where('payload', 'like', '%' . $uniqueId . '%')
            ->exists();

        if (!$exists) {
            // dispatch(new self($userId,'sync'));
            self::dispatch($userId,'sync');
        }
    }
    public function backoff()
    {
        return [10, 30, 60]; // Wait 10s, 30s, 60s between retries
    }
}
