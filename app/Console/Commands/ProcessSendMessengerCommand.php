<?php

namespace App\Console\Commands;

use App\Http\Controllers\MessengerController;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessSendMessengerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // protected $signature = 'app:process-send-messenger-command';
    protected $signature = 'process:process-send-messenger-command {fb_id} {message} {id}';

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
        $fb_id = $this->argument('fb_id');
        $message = $this->argument('message');
        $id = $this->argument('id');

        $messenger_result = MessengerController::sendMessage_($fb_id,$message);

        $jsonStart = strpos($messenger_result, '{');
        $jsonBody = substr($messenger_result, $jsonStart);
        $data = json_decode($jsonBody, true); 
        
        if($data['status'] == "success") {
            DB::table('notifications')->where('id', $id)->update(['status'=>'sent']); 
        } else {
            DB::table('notifications')->where('id', $id)->update(['status'=>'fail']); 
        }  
    }
}
