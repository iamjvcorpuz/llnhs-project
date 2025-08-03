<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('student') == false) {
            Schema::create('student', function (Blueprint $table) {
                $table->id();
                $table->string('qr_code');
                $table->string('lrn');
                $table->string('psa_cert_no');
                $table->string('first_name');
                $table->string('last_name');
                $table->string('middle_name')->nullable();
                $table->string('extension_name')->nullable();
                $table->string('sex');
                $table->string('bdate');
                $table->longText('picture_base64')->nullable();  
                $table->boolean('is_ip')->nullable();
                $table->string('ip_specify')->nullable();
                $table->boolean('is_4ps_benficiary')->nullable();
                $table->string('4ps_id')->nullable();
                $table->boolean('is_disability')->nullable();
                $table->string('type_disability')->nullable();
                $table->string('type2_disability')->nullable();
                $table->string('type_others_disability')->nullable();
                $table->string('cd_hno')->nullable();
                $table->string('cd_sn')->nullable();
                $table->string('cd_barangay')->nullable();
                $table->string('cd_mc')->nullable();
                $table->string('cd_province')->nullable();
                $table->string('cd_country')->nullable();
                $table->string('cd_zip')->nullable();
                $table->string('is_pa_same_cd')->nullable();
                $table->string('pa_hno')->nullable();
                $table->string('pa_sn')->nullable();
                $table->string('pa_barangay')->nullable();
                $table->string('pa_mc')->nullable();
                $table->string('pa_province')->nullable();
                $table->string('pa_country')->nullable();
                $table->string('pa_zip')->nullable();
                $table->string('lglc')->nullable();
                $table->string('lsyc')->nullable();
                $table->string('lsa')->nullable();
                $table->string('lsa_school_id')->nullable();
                $table->string('flsh_semester')->nullable();
                $table->string('flsh_track')->nullable();
                $table->string('flsh_strand')->nullable();
                $table->string('ldm_applied')->nullable(); 
                $table->string('status');
                $table->timestampsTz(precision: 0);
            });
        }

        // Schema::create('teacher', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('qr_code');
        //     $table->string('first_name');
        //     $table->string('last_name');
        //     $table->string('middle_name');
        //     $table->string('extension_name')->nullable();
        //     $table->longText('picture_base64')->nullable();
        //     $table->string('email')->nullable();
        //     $table->string('status'); 
        //     $table->string('bdate');
        //     $table->string('sex');
        //     $table->timestampsTz(precision: 0);
        // });

        if (Schema::hasTable('employee') == false) {
            Schema::create('employee', function (Blueprint $table) {
                $table->id();
                $table->string('employee_type')->nullable();
                $table->string('qr_code');
                $table->string('first_name');
                $table->string('last_name');
                $table->string('middle_name');
                $table->string('extension_name')->nullable();
                $table->longText('picture_base64')->nullable();
                $table->string('email')->nullable();
                $table->string('status'); 
                $table->string('bdate');
                $table->string('sex');
                $table->string('civil_status')->nullable();
                $table->string('religion')->nullable();
                $table->string('ethic_group')->nullable(); 
                $table->timestampsTz(precision: 0);
            });
        }
        if (Schema::hasTable('tranings') == false) {
            Schema::create('tranings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id');
                $table->string('title')->nullable();
                $table->string('experience')->nullable();
                $table->string('total_render')->nullable();
                $table->string('date_from')->nullable();
                $table->string('date_to')->nullable();
                $table->timestampsTz(precision: 0);
            });        
        }
        if (Schema::hasTable('education_background') == false) {
            Schema::create('education_background', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id');
                $table->string('level')->nullable();
                $table->string('name_of_school')->nullable();
                $table->string('basic_edu_degree_course')->nullable();
                $table->string('period_from')->nullable();
                $table->string('period_to')->nullable();
                $table->string('units')->nullable(); 
                $table->string('yr_graduated')->nullable();
                $table->string('ac_ah_recieve')->nullable();  
                $table->timestampsTz(precision: 0);
            });        
        }
        
        if (Schema::hasTable('parents') == false) {
            Schema::create('parents', function (Blueprint $table) {
                $table->id();
                $table->string('qr_code');
                $table->string('first_name');
                $table->string('last_name');
                $table->string('middle_name')->nullable();
                $table->string('extension_name')->nullable();
                $table->string('sex');
                $table->string('bdate')->nullable();
                $table->longText('picture_base64')->nullable();
                $table->string('email')->nullable();
                $table->string('current_address')->nullable();
                $table->string('status'); 
                $table->timestampsTz(precision: 0);
            });        
        }

        if (Schema::hasTable('student_guardians') == false) {
            Schema::create('student_guardians', function (Blueprint $table) {
                $table->id();
                $table->foreignId('parents_id');
                $table->foreignId('student_id');
                $table->string('relationship')->nullable(); 
                $table->string('added_by')->nullable(); 
                $table->timestampsTz(precision: 0);
            });
        }

        if (Schema::hasTable('attendance') == false) {
            Schema::create('attendance', function (Blueprint $table) {
                $table->id();
                $table->string('type');
                $table->string('qr_code');
                $table->string('terminal')->nullable();
                $table->string('terminal_id')->nullable(); 
                $table->foreignId('student_id')->nullable()->index();
                $table->foreignId('teacher_id')->nullable()->index(); 
                $table->string('time');
                $table->string('date'); 
                $table->string('status');
                $table->string('mode');
                $table->timestampsTz(precision: 0);
            });        
        }

        if (Schema::hasTable('notifications') == false) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->id();
                $table->string('type');
                $table->string('to');
                $table->longText('message');
                $table->string('status'); 
                $table->string('date'); 
                $table->string('time');  
                $table->timestampsTz(precision: 0);
            });
        }
        if (Schema::hasTable('contacts') == false) {
            Schema::create('contacts', function (Blueprint $table) {
                $table->id();
                $table->string('type')->nullable();
                $table->string('student_id')->nullable();
                $table->string('teacher_id')->nullable();
                $table->string('guardian_id')->nullable();
                $table->string('phone_number')->nullable(); 
                $table->string('telephone_number')->nullable(); 
                $table->string('messenger_name')->nullable(); 
                $table->string('messenger_id')->nullable(); 
                $table->string('email')->nullable(); 
                $table->string('status')->nullable(); 
                $table->timestampsTz(precision: 0);
            });
        }
        if (Schema::hasTable('school_subjects') == false) {
            Schema::create('school_subjects', function (Blueprint $table) {
                $table->id();
                $table->string('subject_name');
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }
        if (Schema::hasTable('advisory') == false) { 
            Schema::create('advisory', function (Blueprint $table) {
                $table->id();
                $table->string('qrcode')->nullable();
                $table->string('teacher_id')->nullable(); 
                $table->string('school_sections_id')->nullable();
                $table->string('section_name')->nullable();
                $table->string('school_year')->nullable();
                $table->string('subject_id')->nullable();
                $table->string('year_level')->nullable();
                $table->string('description')->nullable();
                $table->string('status')->nullable(); 
                $table->timestampsTz(precision: 0);
            });
        }
        
        if (Schema::hasTable('advisory_group') == false) { 
            Schema::create('advisory_group', function (Blueprint $table) {
                $table->id();
                $table->string('advisory_id')->nullable();
                $table->string('student_id')->nullable();
                $table->string('description')->nullable();
                $table->string('status')->nullable(); 
                $table->timestampsTz(precision: 0);
            });            
        }

        if (Schema::hasTable('school_sections') == false) { 
            Schema::create('school_sections', function (Blueprint $table) {
                $table->id();
                $table->string('teacher_id')->nullable();
                $table->string('section_name')->nullable();
                $table->string('year_grade_id')->nullable();
                $table->string('year_grade')->nullable();
                $table->string('room_no')->nullable();
                $table->string('building_no')->nullable(); 
                $table->string('description')->nullable(); 
                $table->string('status')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }

        if (Schema::hasTable('school_year_grades') == false) { 
            Schema::create('school_year_grades', function (Blueprint $table) {
                $table->id();
                $table->string('year_grade')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }

        if (Schema::hasTable('user_accounts') == false) { 
            Schema::create('user_accounts', function (Blueprint $table) {
                $table->id();
                $table->string('user_type');
                $table->string('user_id');
                $table->integer('user_role_id');
                $table->string('fullname');
                $table->string('username');
                $table->string('password');
                $table->string('plainpassword');
                $table->string('remember_token')->nullable();
                $table->string('verified')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }

        if (Schema::hasTable('roles') == false) { 
            Schema::create('roles', function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable();
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });        
        }

        if (Schema::hasTable('user_roles') == false) { 
            Schema::create('user_roles', function (Blueprint $table) {
                $table->id();
                $table->string('user_id')->nullable();
                $table->string('roles_id')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }

        if (Schema::hasTable('user_roles_permissions') == false) { 
            Schema::create('user_roles_permissions', function (Blueprint $table) {
                $table->id();
                $table->string('user_roles_id')->nullable();
                $table->string('action')->nullable();
                $table->timestampsTz(precision: 0);
            });        
        }

        if (Schema::hasTable('specific_programs') == false) {
            Schema::create('specific_programs', function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable();
                $table->string('acronyms')->nullable();
                $table->string('definition')->nullable();
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }

        if (Schema::hasTable('specialize_program') == false) {
            Schema::create('specialize_program', function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable();
                $table->string('acronyms')->nullable();
                $table->string('definition')->nullable();
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }

        if (Schema::hasTable('classrooms') == false) {
            Schema::create('classrooms', function (Blueprint $table) {
                $table->id();
                $table->string('room_number')->nullable();
                $table->string('floor_number')->nullable();
                $table->string('building_no')->nullable(); 
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }

        if (Schema::hasTable('school_class') == false) {
            Schema::create('school_class', function (Blueprint $table) {
                $table->id();
                $table->string('qr_code')->nullable();
                $table->string('level')->nullable();
                $table->string('grade')->nullable();
                $table->string('track')->nullable(); 
                $table->string('strands')->nullable();
                $table->string('classroom')->nullable();
                $table->string('section_name')->nullable();
                $table->string('school_year')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }
        if (Schema::hasTable('class_teaching') == false) {
            Schema::create('class_teaching', function (Blueprint $table) {
                $table->id();
                $table->string('qr_code')->nullable();
                $table->string('subject_id')->nullable();
                $table->string('teacher_id')->nullable();
                $table->string('class_id')->nullable(); 
                $table->string('subject_name')->nullable();
                $table->string('time_start')->nullable();
                $table->string('time_end')->nullable();
                $table->string('monday')->nullable();
                $table->string('tuesday')->nullable();
                $table->string('wednesday')->nullable();
                $table->string('thursday')->nullable();
                $table->string('friday')->nullable();
                $table->string('saturday')->nullable();
                $table->string('sunday')->nullable();
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });            
        }
        if (Schema::hasTable('holidays') == false) {
            Schema::create('holidays', function (Blueprint $table) {
                $table->id();
                $table->string('type')->nullable();
                $table->string('event_name')->nullable();
                $table->string('date')->nullable(); 
                $table->string('time_start')->nullable();
                $table->string('time_end')->nullable(); 
                $table->string('description')->nullable(); 
                $table->timestampsTz(precision: 0);
            });            
        }
        if (Schema::hasTable('events') == false) {
            Schema::create('events', function (Blueprint $table) {
                $table->id();
                $table->string('qrcode')->nullable();
                $table->string('user_id')->nullable();
                $table->string('type')->nullable();
                $table->string('event_name')->nullable();
                $table->string('facilitator')->nullable();
                $table->string('location')->nullable();
                $table->string('date')->nullable(); 
                $table->string('time_start')->nullable();
                $table->string('time_end')->nullable(); 
                $table->string('description')->nullable(); 
                $table->timestampsTz(precision: 0);
            });            
        }
        
        if (Schema::hasTable('classrooms_seats') == false) { 
            Schema::create('classrooms_seats', function (Blueprint $table) {
                $table->id();
                $table->string('class_teaching_id')->nullable();
                $table->string('class_id')->nullable();
                $table->string('subject_id')->nullable();
                $table->string('number_rows')->nullable();
                $table->string('number_columns')->nullable();
                $table->string('total_students')->nullable(); 
                $table->string('description')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }

        if (Schema::hasTable('classrooms_seats_assign') == false) { 
            Schema::create('classrooms_seats_assign', function (Blueprint $table) {
                $table->id();
                $table->string('classrooms_seats_id')->nullable();
                $table->string('class_id')->nullable();
                $table->string('student_id')->nullable();
                $table->string('seat_number')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }

        if (Schema::hasTable('system_settings') == false) { 
            Schema::create('system_settings', function (Blueprint $table) {
                $table->id();
                $table->string('setting')->nullable();
                $table->string('value')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }
        if (Schema::hasTable('school_registry') == false) { 
            Schema::create('school_registry', function (Blueprint $table) {
                $table->id();
                $table->string('region')->nullable();
                $table->string('division')->nullable();
                $table->string('district')->nullable();
                $table->string('school_id')->nullable();
                $table->string('school_name')->nullable();
                $table->string('school_address')->nullable();
                $table->string('school_year')->nullable();
                $table->string('head_name')->nullable();
                $table->string('head_position')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }
        if (Schema::hasTable('student_final_grades') == false) { 
            Schema::create('student_final_grades', function (Blueprint $table) {
                $table->id();
                $table->string('grade_level')->nullable();
                $table->string('sy')->nullable();
                $table->string('student_id')->nullable();
                $table->string('teacher_id')->nullable();
                $table->string('class_id')->nullable();
                $table->string('subject_id')->nullable();
                $table->string('subject_name')->nullable();
                $table->string('q1')->nullable();
                $table->string('q2')->nullable();
                $table->string('q3')->nullable();
                $table->string('q4')->nullable();
                $table->string('status')->nullable();
                $table->timestampsTz(precision: 0);
            });
        }

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('student');
        // Schema::dropIfExists('teacher');
        // Schema::dropIfExists('user_accounts');
        // Schema::dropIfExists('attendance');
        // Schema::dropIfExists('student_guardians');
        // Schema::dropIfExists('parents');
        // Schema::dropIfExists('notifications');
        // Schema::dropIfExists('school_subjects');
        // Schema::dropIfExists('school_section');
        // Schema::dropIfExists('school_year_grades');
        // Schema::dropIfExists('advisory');
        // Schema::dropIfExists('roles');
        // Schema::dropIfExists('user_roles');
        // Schema::dropIfExists('user_roles_permissions');
        // Schema::dropIfExists('specialize_program');
        // Schema::dropIfExists('specific_programs');
        // Schema::dropIfExists('classrooms');
        // Schema::dropIfExists('school_class');
        // Schema::dropIfExists('events');
        // Schema::dropIfExists('holidays');
        // Schema::dropIfExists('class_teaching');
        // Schema::dropIfExists('employee');
        // Schema::dropIfExists('tranings');
        // Schema::dropIfExists('contacts');
        // Schema::dropIfExists('advisory_group');
        // Schema::dropIfExists('school_sections');
    }
};
