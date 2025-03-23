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

        Schema::create('teacher', function (Blueprint $table) {
            $table->id();
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
            $table->timestampsTz(precision: 0);
        });

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
            $table->string('status'); 
            $table->timestampsTz(precision: 0);
        });

        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parents_id');
            $table->foreignId('student_id');
            $table->string('added_by')->nullable(); 
            $table->timestampsTz(precision: 0);
        });

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

        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('type')->nullable();
            $table->string('student_id')->nullable();
            $table->string('teacher_id')->nullable();
            $table->string('guardian_id')->nullable(); 
            $table->string('phone_number'); 
            $table->string('telephone_number')->nullable(); 
            $table->string('email')->nullable(); 
            $table->string('status')->nullable(); 
            $table->timestampsTz(precision: 0);
        });

        Schema::create('school_subjects', function (Blueprint $table) {
            $table->id();
            $table->string('subject_name');
            $table->string('description')->nullable();
            $table->timestampsTz(precision: 0);
        });

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

        Schema::create('advisory_group', function (Blueprint $table) {
            $table->id();
            $table->string('advisory_id')->nullable();
            $table->string('student_id')->nullable();
            $table->string('description')->nullable();
            $table->string('status')->nullable(); 
            $table->timestampsTz(precision: 0);
        });

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

        Schema::create('school_year_grades', function (Blueprint $table) {
            $table->id();
            $table->string('year_grade')->nullable();
            $table->timestampsTz(precision: 0);
        });

        Schema::create('user_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('user_type');
            $table->string('user_id');
            $table->integer('user_role_id');
            $table->string('fullname');
            $table->string('username');
            $table->string('password');
            $table->string('plainpassword');
            $table->string('verified')->nullable();
            $table->timestampsTz(precision: 0);
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->timestampsTz(precision: 0);
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('roles_id')->nullable();
            $table->timestampsTz(precision: 0);
        });

        Schema::create('user_roles_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('user_roles_id')->nullable();
            $table->string('action')->nullable();
            $table->timestampsTz(precision: 0);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student');
        Schema::dropIfExists('teacher');
        Schema::dropIfExists('user_accounts');
        Schema::dropIfExists('attendance');
        Schema::dropIfExists('student_guardians');
        Schema::dropIfExists('parents');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('school_subjects');
        Schema::dropIfExists('school_section');
        Schema::dropIfExists('school_year_grades');
        Schema::dropIfExists('advisory');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('user_roles_permissions');
    }
};
