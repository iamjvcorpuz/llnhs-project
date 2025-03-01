<?php

namespace Database\Seeders;

use App\Models\Contacts;
use App\Models\Parents;
use App\Models\Roles;
use App\Models\Student;
use App\Models\Subjects;
use App\Models\Teacher;
use App\Models\User;
use App\Models\UserAccounts;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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

                 
        Roles::create([
            'name' => 'Admin',
            'decription' => 'For admin role only',
        ]);
                 
        Roles::create([
            'name' => 'Teacher',
            'decription' => 'For teacher role only',
        ]);

        Roles::create([
            'name' => 'Student',
            'decription' => 'For student role only',
        ]);

        Roles::create([
            'name' => 'Guardian',
            'decription' => 'For guardian role only',
        ]);


        Subjects::factory()->create([
            'subject_name' => 'English',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Math',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Science',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Mathematics',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Filipino',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Araling Panlipunan',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Edukasyon sa Pagpapakatao (EsP)',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Physical Education ',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Technology and Livelihood Education (TLE)',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Mother Tongue',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Music',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Arts',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Health',
            'decription' => '',
        ]);
        Subjects::factory()->create([
            'subject_name' => 'Edukasyong Pantahanan at Pangkabuhayan (EPP)',
            'decription' => '',
        ]);


        $student = Student::factory(100)->create();
        $student->each(function($val) {
            $rand_pass = Str::random(10);
            UserAccounts::factory()->state([
                'user_type' => 'Student',
                'user_role_id' => 3,
                'fullname' => $val->first_name . " " . $val->last_name,
                'username' => Str::random(10),
                'password' => Hash::make($rand_pass),
                'plainpassword' => $rand_pass,
                'verified' => null
            ])->create();
        });

        $teacher = Teacher::factory(10)->create();
        $teacher->each(function($val) {
            Contacts::factory()->state([
                'user_type' => 'teacher',
                'teacher_id' => $val->id,
                'phone_number' => "09758955082",
                'status' => 'active'
            ])->create();
        });

        $teacher->each(function($val) {
            $rand_pass = Str::random(10);
            UserAccounts::factory()->state([
                'user_type' => 'Teacher',
                'user_role_id' => 2,
                'fullname' => $val->first_name . " " . $val->last_name,
                'username' => Str::random(10),
                'password' => Hash::make($rand_pass),
                'plainpassword' => $rand_pass,
                'verified' => null
            ])->create();
        });

        $Parents = Parents::factory(10)->create();

        $Parents->each(function($val) {
            Contacts::factory()->state([
                'user_type' => 'guardian',
                'guardian_id' => $val->id,
                'phone_number' => "09758955082",
                'status' => 'active'
            ])->create();
        });
        
        $teacher->each(function($val) {
            $rand_pass = Str::random(10);
            UserAccounts::factory()->state([
                'user_type' => 'Guardian',
                'user_role_id' => 4,
                'fullname' => $val->first_name . " " . $val->last_name,
                'username' => Str::random(10),
                'password' => Hash::make($rand_pass),
                'plainpassword' => $rand_pass,
                'verified' => null
            ])->create();
        });

    }
}
