<?php

namespace Database\Seeders;

use App\Http\Controllers\SchoolYearGradesController;
use App\Models\Contacts;
use App\Models\Employee;
use App\Models\Parents;
use App\Models\Roles;
use App\Models\SchoolSection;
use App\Models\SchoolYearGrades;
use App\Models\Student;
use App\Models\Subjects;
use App\Models\Teacher;
use App\Models\User;
use App\Models\UserAccounts;
use Illuminate\Database\Eloquent\Factories\Sequence;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Mockery\Matcher\Subset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        
        $school_year_grades = SchoolYearGradesController::getAll();
        $school_year_grades->each(function($val) {
            SchoolSection::factory(50)->state(new Sequence(
                ['year_grade_id' => $val->id,'year_grade' => $val->year_grade]
            ))->create();
        });

        // $school_section = SchoolSection::factory(50)->create();
        // $school_section_room_no = 1;
        // $school_section->each(function($val) { 
        //     $qrcode = Str::random(10);
        //     SchoolSection::factory()->state([
        //         'qrcode' => $qrcode,
        //         'teacher_id' => null,
        //         'section_name' => 3,
        //         'room_no' => $school_section_room_no,
        //         'subject_id' => Str::random(10),
        //         'building_no' => Hash::make($rand_pass),
        //         'description' => $rand_pass,
        //         'status' => null
        //     ])->create();
        // });
        

        $student = Student::factory(100)->create();
        $student->each(function($val) {
            $rand_pass = Str::random(10);
            UserAccounts::factory()->state([
                'user_id' => $val->id,
                'user_type' => 'Student',
                'user_role_id' => 3,
                'fullname' => $val->first_name . " " . $val->last_name,
                'username' => Str::random(10),
                'password' => Hash::make($rand_pass),
                'plainpassword' => $rand_pass,
                'verified' => null
            ])->create();
        });

        // $teacher = Teacher::factory(10)->create();
        // $teacher->each(function($val) {
        //     Contacts::factory()->state([
        //         'type' => 'teacher',
        //         'teacher_id' => $val->id,
        //         'phone_number' => "09758955082",
        //         'status' => 'active'
        //     ])->create();
        //     $rand_pass = Str::random(10);
        //     UserAccounts::factory()->state([
        //         'user_id' => $val->id,
        //         'user_type' => 'Teacher',
        //         'user_role_id' => 2,
        //         'fullname' => $val->first_name . " " . $val->last_name,
        //         'username' => Str::random(10),
        //         'password' => Hash::make($rand_pass),
        //         'plainpassword' => $rand_pass,
        //         'verified' => null
        //     ])->create();
        // });

        $teacher = Employee::factory(10)->create();
        $teacher->each(function($val) {
            Contacts::factory()->state([
                'type' => 'teacher',
                'teacher_id' => $val->id,
                'phone_number' => "09758955082",
                'status' => 'active'
            ])->create();
            $rand_pass = Str::random(10);
            UserAccounts::factory()->state([
                'user_id' => $val->id,
                'user_type' => 'Teacher',
                'user_role_id' => 2,
                'fullname' => $val->first_name . " " . $val->last_name,
                'username' => Str::random(10),
                'password' => Hash::make($rand_pass),
                'plainpassword' => $rand_pass,
                'verified' => null
            ])->create();
        });

        // $teacher->each(function($val) {
        //     $rand_pass = Str::random(10);
        //     UserAccounts::factory()->state([
        //         'user_id' => $val->id,
        //         'user_type' => 'Teacher',
        //         'user_role_id' => 2,
        //         'fullname' => $val->first_name . " " . $val->last_name,
        //         'username' => Str::random(10),
        //         'password' => Hash::make($rand_pass),
        //         'plainpassword' => $rand_pass,
        //         'verified' => null
        //     ])->create();
        // });

        $Parents = Parents::factory(10)->create();

        $Parents->each(function($val) {
            Contacts::factory()->state([
                'type' => 'guardian',
                'guardian_id' => $val->id,
                'phone_number' => "09758955082",
                'status' => 'active'
            ])->create();
            $rand_pass = Str::random(10);
            UserAccounts::factory()->state([
                'user_id' => $val->id,
                'user_type' => 'Guardian',
                'user_role_id' => 4,
                'fullname' => $val->first_name . " " . $val->last_name,
                'username' => Str::random(10),
                'password' => Hash::make($rand_pass),
                'plainpassword' => $rand_pass,
                'verified' => null
            ])->create();
        });
        
        // $Parents->each(function($val) {
        //     $rand_pass = Str::random(10);
        //     UserAccounts::factory()->state([
        //         'user_id' => $val->id,
        //         'user_type' => 'Guardian',
        //         'user_role_id' => 4,
        //         'fullname' => $val->first_name . " " . $val->last_name,
        //         'username' => Str::random(10),
        //         'password' => Hash::make($rand_pass),
        //         'plainpassword' => $rand_pass,
        //         'verified' => null
        //     ])->create();
        // });


    }
}
