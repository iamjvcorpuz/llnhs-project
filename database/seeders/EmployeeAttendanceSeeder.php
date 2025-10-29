<?php

namespace Database\Seeders;

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\StudentController;
use DateInterval;
use DatePeriod;
use DateTime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class EmployeeAttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "start seeding\n";

        $student_list = EmployeeController::getAllTeacher();
        echo "total student: " . count($student_list) . "\n";
        // print_r($student_list);
        $startDate = new DateTime('2025-06-01');
        
        $endDate = (new DateTime('2025-09-01'))->modify('last day of this month');
 
        $interval = new DateInterval('P1D'); 
        $period = new DatePeriod($startDate, $interval, $endDate->modify('+1 day'));
        $time = ["08:00 AM","12:00 PM","12:01 PM","05:00 PM"];

        foreach ($period as $date) { 
            $dayOfWeek = $date->format('w'); 
            if ($dayOfWeek == 0 || $dayOfWeek == 6) {
                continue;
            }

            foreach($student_list as $keys => $values) { 
                foreach($time as $key => $value) {
                    $mode = "";
                    if($key == 0) {
                        $mode = "IN";
                    } else if($key == 1) {
                        $mode = "OUT";
                    } else if($key == 2) {
                        $mode = "IN";
                    } else if($key == 3) {
                        $mode = "OUT";
                    }
                    $postData = [
                        'logsdata' => [
                            "code" => $values->qr_code,
                            "date" => $date->format('Y-m-d'),
                            "time" => $value,
                            "mode" => $mode
                        ],
                        'userdata' => [
                            "id" => $values->id,
                            "type" => "teacher",
                            "uuid" => $values->uuid
                        ]
                    ];
                    echo $values->last_name;
                    echo "\n";
                    print_r($postData); 
                    $this->submitAttendance($postData);
                    echo "\n";
                }
            }
            
        }
    }
    public static function submitAttendance($postData) {
        // Initialize cURL session
        $url = 'http://localhost:8000/attendance/time/new/entry';
        $ch = curl_init($url);

        // Convert array to JSON
        $jsonData = json_encode($postData);
        // Initialize cURL session
        $ch = curl_init($url);

        // Convert array to JSON
        $jsonData = json_encode($postData);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ]);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        // Execute the request
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // Check for errors
        if ($response === false) {
            echo 'cURL Error for : ' . curl_error($ch) . "\n";
        } elseif ($httpCode >= 400) {
            echo 'HTTP Error for : ' . $httpCode . ' - Response: ' . $response . "\n";
        } else {
            echo 'Success for: ' . $response . "\n";
        }

        // Close the cURL session
        curl_close($ch);
    }
}
