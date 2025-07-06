<?php

namespace App\Console\Commands;

use App\Http\Controllers\SMSController;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessSMSCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'process:send-sms {phone_number} {message} {id}';

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
        $fbid = $this->argument('fbid');
        $message = $this->argument('message');
        $id = $this->argument('id');
        try {
            $sms_result = SMSController::_SendSMS_($fbid,$message);

            $jsonStart = strpos($sms_result, '{');
            $jsonBody = substr($sms_result, $jsonStart);
            $data = json_decode($jsonBody, true); 
            
            if($data['status'] == "success") {
                DB::table('notifications')->where('id', $id)->update(['status'=>'sent']); 
            } else {
                DB::table('notifications')->where('id', $id)->update(['status'=>'fail']); 
            }
        }
        catch(\Throwable $th) {
            DB::table('notifications')->where('id', $id)->update(['status'=>'fail']); 
        }
    }
}
