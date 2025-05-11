<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use App\Models\Contacts;
use App\Models\MessengerFB;
use App\Models\Parents;
use App\Models\StudentGuardian;
use Illuminate\Http\Client\Response;
use stdClass;

class MessengerController extends Controller
{
    // private $_url = "https://graph.facebook.com/v21.0"; 
    
    public static function sendMessage_($id,$message) {
        // return self::send($id,$message);
        return (new self)->send($id,$message); 
    }

    public static function sendMessage(Request $request) {
        $id = $request->id;
        $message = $request->message; 
        return (new self)->send($id,$message); 
    }

    public function send($id,$message) {
        $url = env('MESSENGER_API_URL','https://graph.facebook.com/v21.0').'/'.env('MESSENGER_PAGE_ID').'/messages';
        try {
            $params = [
                'message' => '{"text":"'.addslashes($message).'"}',
                'recipient' => '{"id":"'.$id.'"}'
            ];
            $headers = [
                'Content-Type' => 'application/json', 
                'Authorization' => 'Bearer '.env('MESSENGER_VERIFY_TOKEN') 
            ];
            $response = Http::withHeaders($headers)->withQueryParameters($params)->timeout(15)->post($url); 
            // print_r($response->object()->data);
            // echo $url;
            // echo "<pre>";
            // print_r($response->object());
            // echo "</pre>";
            // echo "<pre>";
            // print_r($response);
            // echo "</pre>";
            if($response->status()==200) {
                // return $response;
                return response()->json([
                    'status' => 'success',
                    'message' => 'message sent!',
                    'errors' => null
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => 'Validation error'
                ], 422);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => 'Validation error'
            ], 500);
        }
    }

    public static function pullMessengerClientData() {

        // return  self::fetchRecipients();
        // return  self::fetchRecipients();
        $foo = new MessengerController();
        return $foo->fetchRecipients();
        
    }
    public function getRecipients() {

        $list = array();
        $messenger = DB::select('SELECT ROW_NUMBER() OVER () as \'index\',fullname,email,fb_id  FROM messenger ');
        foreach ($messenger as $key => $value) { 
            $contact = DB::table('contacts')->where('messenger_id', $value->fb_id)->get();
            if($contact->count()==0) {
                array_push($list,$value);
            }
        }
        return response()->json([
            'status' => 'success',
            'error' => null,
            'data' => $list
        ], 200);
    }
    private function fetchRecipients() {
        $list = array();
        try {
            // $url = $this->_url.'/'.env('MESSENGER_PAGE_ID').'/conversations';
            $url = env('MESSENGER_API_URL','https://graph.facebook.com/v21.0').'/'.env('MESSENGER_PAGE_ID').'/conversations';
            $params = [
                'fields' => 'participants{id,message}',
                'access_token' => env('MESSENGER_VERIFY_TOKEN')
            ];
            $headers = [
                'Content-Type' => 'application/json', 
                'Authorization' => 'Bearer '.env('MESSENGER_VERIFY_TOKEN') 
            ];
            $response = Http::withHeaders($headers)->withQueryParameters($params)->timeout(15)->get($url); 
            // print_r($response->object()->data);
            // echo $url;
            // echo "<pre>";
            
            $index = 0;
            foreach ($response->object()->data as $key => $value) {
                // print_r($value->participants->data[0]);
                $index++;
                $object = new stdClass();
                $object2 = new stdClass();
                $object->index = $index;
                $object->fullname = $value->participants->data[0]->name;
                $object->fb_id = $value->participants->data[0]->id;
                $object2->index = $index;
                $object2->fullname = $value->participants->data[0]->name; 
                $messenger = DB::table('messenger')
                    ->where('fullname', '=', $value->participants->data[0]->name)
                    ->orWhere('fb_id', '=', $value->participants->data[0]->id)
                    ->get();
                if($messenger->count()==0) {
                    MessengerFB::create([
                        'fullname' => $value->participants->data[0]->name,
                        'fb_id' => $value->participants->data[0]->id,
                        'email' => $value->participants->data[0]->email
                    ]);
                }
                array_push($list,$object2);
            }
            // print_r($response->object()->data);
            // echo "</pre>";
            if($response->status()==200) {
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $list
                ], 200);
            } else {
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => $list
                ], 200);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'fail',
                'error' => null,
                'data' => $list
            ], 200);
        }
    }
}
