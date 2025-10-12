<?php

namespace Database\Seeders;

use App\Http\Controllers\StudentController;
use App\Models\UserAccounts;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentAccountsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $student_list = StudentController::getAllActive__();
        foreach($student_list as $keys => $val) { 

            $firstname = $val->first_name;
            $lastname = $val->last_name;
            $parts = explode(" ", $firstname);
            $usernames = "";
            $password = $val->lrn;
            
            foreach($parts as $value) {
                $usernames= $usernames . ucfirst($value[0]);
            }

            $usernames = trim($usernames) . str_replace(' ', '',ucfirst(strtolower($lastname)));
            
            $acc = DB::table('user_accounts')->where('user_id', $val->uuid)->where('user_type', 'Student');
            if($acc->count() == 0) {
                echo "\nAdded ". $val->first_name . " " . $val->last_name;
                $UserAccounts = UserAccounts::create([
                    'user_id' => $val->uuid,
                    'user_type' => 'Student',
                    'user_role_id' => 3,
                    'fullname' =>  $val->first_name . " " . $val->last_name,
                    'username' => $usernames,
                    'password' => Hash::make($password),
                    'plainpassword' => $password,
                    'verified' => null
                ]);      
                DB::table('user_accounts')->where('id', $UserAccounts->id)->update(['uuid' => $UserAccounts->id]);          
            } else {
                echo "\nUpdate ". $val->first_name . " " . $val->last_name;
                DB::table('user_accounts')->where('user_id', $val->uuid)->where('user_type', 'Student')->update(['password'=>Hash::make($password),'plainpassword' => $password]);
            }

        }
        
    }
}
