<?php

namespace App\Console\Commands;

use App\Http\Controllers\SMSController;
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
        $phone_number = $this->argument('phone_number');
        $message = $this->argument('message');
        $id = $this->argument('id');

        $sms_result = SMSController::_SendSMS_($phone_number,$message);

        $jsonStart = strpos($sms_result, '{');
        $jsonBody = substr($sms_result, $jsonStart);
        $data = json_decode($jsonBody, true); 
        
        if($data['status'] == "success") {
            DB::table('notifications')->where('id', $id)->update(['status'=>'sent']); 
        } else {
            DB::table('notifications')->where('id', $id)->update(['status'=>'fail']); 
        }        

    }
}
