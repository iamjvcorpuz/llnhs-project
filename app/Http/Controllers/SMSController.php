<?php 
namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Concurrency;

class SMSController extends Controller
{
    // middle ware para sa sms
    public static function testSendSMS(Request $params) 
    {
        $sms = new sendSMS();
        $phone_number = $params->phone_number;
        $message = $params->message;


        $status = $sms->send($phone_number,$message);
        
        if ($status) {
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 200);
        } else {
            return response()->json([
                'status' => 'fail',
                'error' => null,
                'data' => []
            ], 201);
        }      

    }
    public static function SendSMS(Request $params) 
    {
        print_r($params);
        $sms = new sendSMS();
        $phone_number = $params->phone_number;
        $message = $params->message;


        $status = $sms->send($phone_number,$message);
        
        if ($status) {
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 200);
        } else {
            return response()->json([
                'status' => 'fail',
                'error' => null,
                'data' => []
            ], 201);
        }      

    }
    public static function _SendSMS($params) 
    {
        $sms = new sendSMS();
        $phone_number = $params->phone_number;
        $message = $params->message;

        try {
            //code...
            // \parallel\run(
            //     function() {
            //         $sms->send($phone_number,$message);
            //     }
            // );
            Concurrency::run([
                $sms->send($phone_number,$message)
            ]);
            // Concurrency::defer([
            //     $sms->send($phone_number,$message)
            // ]);
            // $status = $sms->send($phone_number,$message);
            
            // if ($status) {
                return response()->json([
                    'status' => 'success',
                    'error' => null,
                    'data' => []
                ], 200);
            // } else {
            //     return response()->json([
            //         'status' => 'fail',
            //         'error' => null,
            //         'data' => []
            //     ], 201);
            // } 
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'fail',
                'error' => null,
                'data' => []
            ], 201);
        }

    }
    public static function SendSMSAttendance(Request $params) 
    {
        $sms = new sendSMS();
        $phone_number = $params->phone_number;
        $pangalan = $params->pangalan;
        $mode = $params->mode=='IN'?'nakapasok':'nakalabas'; 
        $time = $params->time;
        
        $message = 'Matagumpay ' . $mode . ' sa Paaralan ng Lebak Legislated NHS si ' . $pangalan . ' sa saktong ' . $time;

        $status = $sms->send($phone_number,$message);
        
        if ($status) {
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 200);
        } else {
            return response()->json([
                'status' => 'fail',
                'error' => null,
                'data' => []
            ], 201);
        }
    }
    public static function DeleteAllOutboxMSG() 
    {
        $sms = new sendSMS(); 


        $status = $sms->delete_all_sms();
        
        if ($status) {
            return response()->json([
                'status' => 'success',
                'error' => null,
                'data' => []
            ], 200);
        } else {
            return response()->json([
                'status' => 'fail',
                'error' => null,
                'data' => []
            ], 201);
        }      

    }
}

class sendSMS {
    // main controller sa sms
    public function send($phoneumber, $message) {

        $sms = new gsm_request_url();

        $status = $sms->sms_send($phoneumber,$message);

        return $status;
    }
    public function delete_all_sms() {

        $sms = new gsm_request_url();

        $status = $sms->sms_delete_all();

        return $status;
    }
}

class gsm_request_url {


    private $_url_prefix = "http://"; 
    private $_url_post = "/goform/goform_process";
    private $_modem_ip = "192.168.0.1";


    private $GSM7_Table = array(
        "0040","00A3","0024","00A5","00E8","00E9","00F9","00EC","00F2","00C7","000A","00D8",
        "00F8","000D","00C5","00E5","0394","005F","03A6","0393","039B","03A9","03A0","03A8",
        "03A3","0398","039E","00A0","00C6","00E6","00DF","00C9","0020","0021","0022","0023",
        "00A4","0025","0026","0027","0028","0029","002A","002B","002C","002D","002E","002F",
        "0030","0031","0032","0033","0034","0035","0036","0037","0038","0039","003A","003A",
        "003B","003C","003D","003E","003F","00A1","0041","0042","0043","0044","0045","0046",
        "0047","0048","0049","004A","004B","004C","004D","004E","004F","0050","0051","0052",
        "0053","0054","0055","0056","0057","0058","0059","005A","00C4","00D6","00D1","00DC",
        "00A7","00BF","0061","0062","0063","0064","0065","0066","0067","0068","0069","006A",
        "006B","006C","006D","006E","006F","0070","0071","0072","0073","0074","0075","0076",
        "0077","0078","0079","007A","00E4","00F6","00F1","00FC","00E0","000C","005E","007B",
        "007D","005C","005B","007E","005D","007C","20AC"
    );
    
    private $GSM7_Table_extend = array(
        "000C","005E","007B","007D","005C","005B","007E","005D","007C","20AC"
    );
    
    private $GSM7_Table_Spanish = array(
        "0040","00A3","0024","00A5","00E8","00E9","00F9","00EC","00F2","00C7","000A","00D8",
        "00F8","00E5","0394","005F","03A6","0393","039B","03A9","03A0","03A8","03A3","0398",
        "039E","00A0","00C6","00E6","00DF","00C9","0020","0021","0022","0023","00A4","0025",
        "0026","0027","0028","0029","002A","002B","002C","002D","002E","002F","0030","0031",
        "0032","0033","0034","0035","0036","0037","0038","0039","003A","003B","003C","003D",
        "003E","003F","00A1","0041","0042","0043","0044","0045","0046","0047","0048","0049",
        "004A","004B","004C","004D","004E","004F","0050","0051","0052","0053","0054","0055",
        "0056","0057","0058","0059","005A","00C4","00D6","00D1","00DC","00A7","00BF","0061",
        "0062","0063","0064","0065","0066","0067","0068","0069","006A","006B","006C","006D",
        "006E","006F","0070","0071","0072","0073","0074","0075","0076","0077","0078","0079",
        "007A","00E4","00F6","00F1","00FC","00E0","00E7","000C","000D","005E","007B","007D",
        "005C","005B","007E","005D","007C","00C1","00CD","00D3","00DA","00E1","20AC","00ED",
        "00F3","00FA"
    );
    
    private $GSM7_Table_Spanish_extend = array(
        "00E7","000C","005E","007B","007D","005C","005B","007E","005D","007C","00C1","00CD",
        "00D3","00DA","00E1","20AC","00ED","00F3","00FA"
    );
    
    private $GSM7_Table_Portuguese = array(
        "0040","00A3","0024","00A5","00EA","00E9","00FA","00ED","00F3","00C7","000A","00D4",
        "00F4","000D","00C1","00E1","0394","005F","00AA","00C7","00C0","221E","005E","005C",
        "20AC","00D3","007C","00A0","00C2","00E2","00CA","00C9","0020","0021","0022","0023",
        "00B0","0025","0026","0027","0028","0029","002A","002B","002C","002D","002E","002F",
        "0030","0031","0032","0033","0034","0035","0036","0037","0038","0039","003A","003B",
        "003C","003D","003E","003F","00CD","0041","0042","0043","0044","0045","0046","0047",
        "0048","0049","004A","004B","004C","004D","004E","004F","0050","0051","0052","0053",
        "0054","0055","0056","0057","0058","0059","005A","00C3","00D5","00DA","00DC","00A7",
        "007E","0061","0062","0063","0064","0065","0066","0067","0068","0069","006A","006B",
        "006C","006D","006E","006F","0070","0071","0072","0073","0074","0075","0076","0077",
        "0078","0079","007A","00E3","00F5","0060","00FC","00E0","00E7","000C","00D4","00F4",
        "000D","00C1","00E1","03A6","0393","005E","03A9","03A0","03A8","03A3","0398","00CA",
        "007B","007D","005C","005B","007E","005D","007C","00C0","00CD","00D3","00DA","00C3",
        "00D5","00C2","20AC","00ED","00F3","00FA","00E3","00F5","00E2"
    );
    
    private $GSM7_Table_Portuguese_extend = array(
        "00E7","000C","00D4","00F4","000D","00C1","00E1","03A6","0393","005E","03A9","03A0",
        "03A8","03A3","0398","00CA","007B","007D","005C","005B","007E","005D","007C","00C0",
        "00CD","00D3","00DA","00C3","00D5","00C2","20AC","00ED","00F3","00FA","00E3","00F5",
        "00E2"
    );

    public function sms_send($phoneumber, $message)
    {
        try {
            $url = $this->_url_prefix.$this->_modem_ip.$this->_url_post;
            $encodehex = new Hex('ENC',$message);
            $untranlated = $encodehex->decode_encode(); 
            $params = [
                'goformId' => 'SEND_MESSAGE',
                'lucknum_SEND_MESSAGE' => '',
                'lucknum_SAVE_MESSAGE' => '',
                'phone_number_sender' => $phoneumber,
                'reply_SMS_Content' => $message,
                'msg_content' => $this->encodeSendMessage($message),
                'which_cgi' => 'native_inbox',
                'encode_type' => $this->GSM7_span_or_UCS2($untranlated)
            ];
            // 'Content-Length' => '299',
            $headers = [
                'Accept' => '*/*',
                'Accept-Encoding' => 'gzip, deflate',
                'Accept-Language' => 'en-US,en;q=0.9',
                'Connection' => 'keep-alive',
                'Content-Type' => 'application/x-www-form-urlencoded',
                'Cookie' => 'ipaddr=192.168.0.100; exception=4; mLangage=en; lucknum=452235; sim_inbox_page=1; native_inbox_page=1; exception=4; ipaddr=192.168.0.100; mLangage=en',
                'DNT' => '1',
                'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'X-Requested-With' => 'XMLHttpRequest'
            ];
            // 'Content-Length' => '',
            $response = Http::withHeaders($headers)->timeout(15)->asForm()->post($url,$params);
            // echo $url . "<br />"; 
            // echo '<pre>';
            // print_r($headers);
            // print_r($params);
            // // print_r(['goformId' => 'SEND_MESSAGE',
            // // 'lucknum_SEND_MESSAGE' => '',
            // // 'lucknum_SAVE_MESSAGE' => '452235',
            // // 'phone_number_sender' => $phoneumber,
            // // 'reply_SMS_Content' => $message,
            // // 'msg_content' => $untranlated,
            // // 'msg_content_dec' => $dencodehex->decode_encode(),
            // // 'which_cgi' => 'native_inbox',
            // // 'encode_type' =>  $this->GSM7_span_or_UCS2($untranlated) ]);
            // print_r($response->headers());
            // echo '</pre>';
            // // 'GSM7_default'
            // echo $response->body();
            // echo "<br />";
            // echo $response->status();
            // echo "<br />";
            // echo $response->failed();
            // echo "<br />";
            if($response->status()==200) {
                return true;
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            return false;
        }
  
        
    }
    public function sms_delete_all()
    {
        $url = $this->_url_prefix.$this->_modem_ip.$this->_url_post; 
        $params = [
            'goformId' => 'ALLDEL_MESSAGE',
            'lucknum_DELETE_MESSAGE' => '',
            'lucknum_ALLDEL_MESSAGE' => '452235',
            'inbox_search' => '',
            'which_cgi' => 'native_outbox',
            'msg_id' => ''
        ];
        // 'Content-Length' => '299',
        $headers = [
            'Accept' => '*/*',
            'Accept-Encoding' => 'gzip, deflate',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Connection' => 'keep-alive',
            'Content-Type' => 'application/x-www-form-urlencoded',
            'origin' => $this->_url_prefix.$this->_modem_ip,
            'referer' => $this->_url_prefix.$this->_modem_ip.'/sms/native_outbox.asp',
            'Cookie' => 'ipaddr=192.168.0.100; exception=4; mLangage=en; lucknum=452235; sim_inbox_page=1; native_inbox_page=1; exception=4; ipaddr=192.168.0.100; mLangage=en',
            'DNT' => '1',
            'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
            'X-Requested-With' => 'XMLHttpRequest'
        ];
        
        $response = Http::withHeaders($headers)->timeout(15)->asForm()->post($url,$params); 
        if($response->status()==200) {
            return true;
        } else {
            return false;
        }
  
        
    }
    
    function wordMode($input) {
        $flag = "ASCII";
        if ($input === null || $input === "") {
            return $flag;
        }
        
        for ($i = 0; $i < strlen($input); $i++) {
            $c = dechex(ord($input[$i]));
            if (strlen($c) >= 3) {
                $flag = "UNICODE";
                break;
            }
        }
        
        return $flag;
    }
    
    function encodeSendMessage($input) {
        // encode the sending contents
        $UNICODE_encode = "";
        $flag = 0;
        $ASCII_encode = "";
        
        if ($input === null || $input === "") {
            return "";
        }
        
        for ($i = 0; $i < strlen($input); $i++) {
            $c = dechex(ord($input[$i]));
            
            // save ASCII coding
            if ($c === "b7") {
                $c = "00b7";
            }
            if ($c === "60") {
                $c = "0060";
            }
            
            if (strlen($c) === 2) {
                $ASCII_encode .= $c;
            }
            else if (strlen($c) === 1) {
                $ASCII_encode .= "0" . $c;
            }
            
            if (strlen($c) >= 3) {
                $flag = 1;
            }
            
            if (strlen($c) === 1) {
                $c = "000" . $c;
            }
            else if (strlen($c) === 2) {
                $c = "00" . $c;
            }
            else if (strlen($c) === 3) {
                $c = "0" . $c;
            }
            
            $UNICODE_encode .= $c;
        }
        
        return $UNICODE_encode;
    }
    
    function GSM7_span_or_UCS2($content) {
        $content = strtoupper($content);
        $length_Table = count($this->GSM7_Table);
        $flag = 0;
        $content_len = strlen($content);
        $content_item = "";
        $encode = "UNICODE";
        
        for ($j = 0; $j < $content_len; $j += 4) {
            $content_item = substr($content, $j, 4);
            $flag = 0;
            
            for ($i = 0; $i < $length_Table; $i++) {
                if ($content_item === $this->GSM7_Table[$i]) {
                    $flag = 1;
                    break;
                }
            }
            
            if ($flag === 0) {
                break;
            }
        }
        
        if ($flag === 1) {
            $encode = "GSM7_default";
        } else {
            $encode = "UNICODE";
        }
        
        return $encode;
    }
}

//Send SMS via serial SMS modem
class gsm_modem {

    public $port = 'COM1';
    public $baud = 19200;

    public $debug = false;

    private $fp;
    private $buffer;

    //Setup COM port
    public function init() {

        $this->debugmsg("Setting up port: \"{$this->port} @ \"{$this->baud}\" baud");

        exec("MODE {$this->port}: BAUD={$this->baud} PARITY=N DATA=8 STOP=1", $output, $retval);

        if ($retval != 0) {
            throw new Exception('Unable to setup COM port, check it is correct');
        }

        $this->debugmsg(implode("\n", $output));

        $this->debugmsg("Opening port");

        //Open COM port
        $this->fp = fopen($this->port . ':', 'r+');

        //Check port opened
        if (!$this->fp) {
            throw new Exception("Unable to open port \"{$this->port}\"");
        }

        $this->debugmsg("Port opened");
        $this->debugmsg("Checking for responce from modem");

        //Check modem connected
        fputs($this->fp, "AT\r");

        //Wait for ok
        $status = $this->wait_reply("OK\r\n", 5);

        if (!$status) {
            throw new Exception('Did not receive responce from modem');
        }

        $this->debugmsg('Modem connected');

        //Set modem to SMS text mode
        $this->debugmsg('Setting text mode');
        fputs($this->fp, "AT+CMGF=1\r");

        $status = $this->wait_reply("OK\r\n", 5);

        if (!$status) {
            throw new Exception('Unable to set text mode');
        }

        $this->debugmsg('Text mode set');

    }

    //Wait for reply from modem
    private function wait_reply($expected_result, $timeout) {

        $this->debugmsg("Waiting {$timeout} seconds for expected result");

        //Clear buffer
        $this->buffer = '';

        //Set timeout
        $timeoutat = time() + $timeout;

        //Loop until timeout reached (or expected result found)
        do {

            $this->debugmsg('Now: ' . time() . ", Timeout at: {$timeoutat}");

            $buffer = fread($this->fp, 1024);
            $this->buffer .= $buffer;

            usleep(200000);//0.2 sec

            $this->debugmsg("Received: {$buffer}");

            //Check if received expected responce
            if (preg_match('/'.preg_quote($expected_result, '/').'$/', $this->buffer)) {
                $this->debugmsg('Found match');
                return true;
                //break;
            } else if (preg_match('/\+CMS ERROR\:\ \d{1,3}\r\n$/', $this->buffer)) {
                return false;
            }

        } while ($timeoutat > time());

        $this->debugmsg('Timed out');

        return false;

    }

    //Print debug messages
    private function debugmsg($message) {

        if ($this->debug == true) {
            $message = preg_replace("%[^\040-\176\n\t]%", '', $message);
            echo $message . "\n";
        }

    }

    //Close port
    public function close() {

        $this->debugmsg('Closing port');
        var_dump($this->fp);
        fclose($this->fp);

    }

    //Send message
    public function send($tel, $message) {
        //Filter tel
        $tel = preg_replace("%[^0-9\+]%", '', $tel);

        //Filter message text
        //$message = preg_replace("%[^\040-\176\r\n\t]%", '', $message);

        $this->debugmsg("Sending message \"{$message}\" to \"{$tel}\"");

        //Start sending of message
        fputs($this->fp, "AT+CMGS=\"{$tel}\"\r");

        //Wait for confirmation
        $status = $this->wait_reply("\r\n> ", 5);

        if (!$status) {
            //throw new Exception('Did not receive confirmation from modem');
            $this->debugmsg('Did not receive confirmation from modem');
            return false;
        }

        //Send message text
         fputs($this->fp, $message);


        //Send message finished indicator
        fputs($this->fp, chr(26));

        //Wait for confirmation
        $status = $this->wait_reply("OK\r\n", 180);

        if (!$status) {
            //throw new Exception('Did not receive confirmation of messgage sent');
            $this->debugmsg('Did not receive confirmation of messgage sent');
            return false;
        }

        $this->debugmsg("Message sent");

        return true;

    }

}

class Hex
{

  private $_type = "";
  private $_data = "";

  public function __construct($type, $data)
  {
    $this->_type = $type;
    $this->_data = $data;
    mb_internal_encoding("UTF-8");
  }

  /*
  * Decode or Encode
  * return @string
  */
  public function decode_encode()
  {
    if ( ($this->_type!= "DEC") && ($this->_type != "ENC") ) {
      return "Error_-_Invalid_Hex_Type";
    }

    if ($this->_type == "DEC") {
      $l=mb_strlen($this->_data)/4;
		  $res='';
		  for ($i=0;$i<$l;$i++) {
         $res.=html_entity_decode('&#'.hexdec(mb_substr($this->_data,$i*4,4)).';',ENT_NOQUOTES,'UTF-8');
       }
    }

    if ($this->_type == "ENC") {
      $l=mb_strlen($this->_data);
      $res='';
      for ($i=0;$i<$l;$i++)
      {
        $s = mb_substr($this->_data,$i,1);
        $s = mb_convert_encoding($s, 'UCS-2LE', 'UTF-8');
          $s = dechex(ord(substr($s, 1, 1))*256+ord(substr($s, 0, 1)));
          if (mb_strlen($s)<4) $s = str_repeat("0",(4-mb_strlen($s))).$s;
          $res.=$s;
        }
    }

    return $res;
  }

}

class Json
{

  private $_type = "";
  private $_data = "";
  private $_assoc = "";

  public function __construct($type, $data, $assoc = "")
  {
    $this->_type = $type;
    $this->_data = $data;

    if ( (strlen($assoc)<1) && (!$assoc) ) {
        $this->_assoc = true;
      } else {
        $this->_assoc = false;
      }
  }

  /*
  * Decode or Encode
  * return @array, @object or @string
  */
  public function decode_encode()
  {
    if ( ($this->_type!= "DEC") && ($this->_type != "ENC") ) {
      return "Error_-_Invalid_Json_Type";
    }

      if ($this->_type == "DEC") {
        $ret = json_decode($this->_data, $this->_assoc);
      }

      if ($this->_type== "ENC") {
        $ret = json_encode($this->_data);
      }

    return $ret;
  }

}