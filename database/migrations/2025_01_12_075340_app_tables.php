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
            $table->string('psa_cert_no');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name');
            $table->string('extension_name');
            $table->string('bdate');
            $table->string('status');
            $table->string('picture_base64'); 
            $table->timestampsTz(precision: 0);
        });

        Schema::create('teacher', function (Blueprint $table) {
            $table->id();
            $table->string('qr_code');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name');
            $table->string('extension_name');
            $table->string('picture_base64');
            $table->string('email');
            $table->string('status'); 
            $table->string('bdate');
            $table->timestampsTz(precision: 0);
        });

        Schema::create('parents', function (Blueprint $table) {
            $table->id();
            $table->string('qr_code');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name');
            $table->string('extension_name');
            $table->string('picture_base64');
            $table->string('email');
            $table->string('status'); 
            $table->string('bdate');
            $table->timestampsTz(precision: 0);
        });
        
        Schema::create('user_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('user_type');
            $table->string('fullname');
            $table->string('username');
            $table->string('userpassword');
            $table->timestampsTz(precision: 0);
        });

        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();
            $table->string('parents_id');
            $table->string('student_id');
            $table->string('added_by'); 
            $table->timestampsTz(precision: 0);
        });

        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('qr_code');
            $table->foreignId('student_id')->nullable()->index();
            $table->foreignId('teacher_id')->nullable()->index();
            // $table->string('student_id');
            // $table->string('teacher_id');
            $table->string('time_in');
            $table->string('time_out');
            $table->string('date'); 
            $table->timestampsTz(precision: 0);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('to');
            $table->string('message');
            $table->string('status'); 
            $table->string('date'); 
            $table->string('time'); 
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
    }
};
