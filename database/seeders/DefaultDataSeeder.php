<?php

namespace Database\Seeders;

use App\Models\Contacts;
use App\Models\Parents;
use App\Models\Roles;
use App\Models\SchoolSection;
use App\Models\SchoolYearGrades;
use App\Models\Student;
use App\Models\Subjects;
use App\Models\Teacher;
use App\Models\User;
use App\Models\UserAccounts;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Mockery\Matcher\Subset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DefaultDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //----start for default data lang ni
        Roles::create([
            'id' => 1,
            'name' => 'Admin',
            'description' => 'For admin role only',
        ]);
                 
        Roles::create([
            'id' => 2,
            'name' => 'Teacher',
            'description' => 'For teacher role only',
        ]);

        Roles::create([
            'id' => 3,
            'name' => 'Student',
            'description' => 'For student role only',
        ]);

        Roles::create([
            'id' => 4,
            'name' => 'Guardian',
            'description' => 'For guardian role only',
        ]);


        Roles::create([
            'id' => 5,
            'name' => 'Employee',
            'description' => 'For Employee role only',
        ]);
        

        Subjects::factory()->create([
            'subject_name' => 'English',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Math',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Science',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Mathematics',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Filipino',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Araling Panlipunan',
            'description' => 'Araling Panlipunan (social sciences)',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Edukasyon sa Pagpapakatao (EsP)',
            'description' => 'Edukasyon sa Pagpapakatao, EsP (personnel training)',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Physical Education ',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Technology and Livelihood Education (TLE)',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Mother Tongue',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Music',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Arts',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Health',
            'description' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
            'description' => 'Edukasyong Pantahanan at Pangkabuhayan (health, home and life education)',
        ]);

        UserAccounts::factory()->state([
            'user_id' => 0,
            'user_type' => 'Admin',
            'user_role_id' => 1,
            'fullname' => "Administrator",
            'username' => "admin",
            'password' => Hash::make('4dm!n'),
            'plainpassword' => '4dm!n',
            'verified' => null
        ])->create();

        SchoolYearGrades::factory()->state([
            'year_grade' => "Grade 7",
        ])->create();
        SchoolYearGrades::factory()->state([
            'year_grade' => "Grade 8",
        ])->create();
        SchoolYearGrades::factory()->state([
            'year_grade' => "Grade 9",
        ])->create();
        SchoolYearGrades::factory()->state([
            'year_grade' => "Grade 10",
        ])->create();
        SchoolYearGrades::factory()->state([
            'year_grade' => "Grade 11",
        ])->create();
        SchoolYearGrades::factory()->state([
            'year_grade' => "Grade 12",
        ])->create();

        DB::table('specific_programs')->insert([
            'name' => 'Academic', 
            'acronyms' => 'ACAD', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);

        DB::table('specific_programs')->insert([
            'name' => 'Technical-Vocational-Livelihood', 
            'acronyms' => 'TVL', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);

        DB::table('specific_programs')->insert([
            'name' => 'Arts and Design', 
            'acronyms' => 'AD', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);

        DB::table('specific_programs')->insert([
            'name' => 'Sports', 
            'acronyms' => '', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);


        DB::table('specialize_program')->insert([
            'name' => 'Accountancy, Business and Management', 
            'acronyms' => 'ABS', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);


        DB::table('specialize_program')->insert([
            'name' => 'Science, Technology, Engineering, and Mathematics', 
            'acronyms' => 'STEM', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);


        DB::table('specialize_program')->insert([
            'name' => 'Humanities and Social Science', 
            'acronyms' => 'HUMSS', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);


        DB::table('specialize_program')->insert([
            'name' => 'General Academic', 
            'acronyms' => 'GAS', 
            'definition' => '', 
            'description' => '',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        
        DB::table('classrooms')->insert([
            'room_number' => '100', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '101', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '102', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '103', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '104', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '105', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '106', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '107', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '108', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('classrooms')->insert([
            'room_number' => '109', 
            'floor_number' => 'NA', 
            'building_no' => '111', 
            'description' => 'NA',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);

        DB::table('system_settings')->insert([
            'setting' => 'ENABLE_SMS', 
            'value' => 'false',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        DB::table('system_settings')->insert([
            'setting' => 'ENABLE_FB_MESSENGER', 
            'value' => 'false',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        
        DB::table('system_settings')->insert([
            'setting' => 'ENABLE_PUSH_NOTIFICATION', 
            'value' => 'false',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        
        DB::table('system_settings')->insert([
            'setting' => 'ATTENDANCE_CLASS_STUDENT_ABSENT', 
            'value' => 'Matagumpay naka pasok sa klase si %s sa saktong oras ng %s %s',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        
        DB::table('system_settings')->insert([
            'setting' => 'ATTENDANCE_CLASS_STUDENT_PRESENT', 
            'value' => 'Matagumpay naka %s sa klase si %s sa saktong %s %s',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);

        DB::table('system_settings')->insert([
            'setting' => 'SCHOOL_YEAR', 
            'value' => '2025 - 2026',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);

        DB::table('system_settings')->insert([
            'setting' => 'VERIFIER_URL', 
            'value' => 'https://tinyurl.com/4v4uxjfj',
            "created_at" =>  \Carbon\Carbon::now(),
            "updated_at" => \Carbon\Carbon::now()
        ]);
        //----end for default data lang ni
    }
}
