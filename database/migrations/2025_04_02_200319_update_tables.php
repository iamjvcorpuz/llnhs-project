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
        // Schema::create('classrooms', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('room_number')->nullable();
        //     $table->string('floor_number')->nullable();
        //     $table->string('building_no')->nullable(); 
        //     $table->string('description')->nullable();
        //     $table->timestampsTz(precision: 0);
        // });

        // Schema::create('messenger', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('fullname')->nullable();
        //     $table->string('email')->nullable();
        //     $table->string('fb_id')->nullable(); 
        //     $table->timestampsTz(precision: 0);
        // });

        // Schema::create('school_class', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('level')->nullable();
        //     $table->string('grade')->nullable();
        //     $table->string('track')->nullable(); 
        //     $table->string('strands')->nullable();
        //     $table->string('classroom')->nullable();
        //     $table->string('school_year')->nullable();
        //     $table->timestampsTz(precision: 0);
        // });

        // Schema::create('classrooms_seats', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('class_teaching_id')->nullable();
        //     $table->string('class_id')->nullable();
        //     $table->string('subject_id')->nullable();
        //     $table->string('number_rows')->nullable();
        //     $table->string('number_columns')->nullable();
        //     $table->string('total_students')->nullable(); 
        //     $table->string('description')->nullable();
        //     $table->timestampsTz(precision: 0);
        // });

        // Schema::create('classrooms_seats_assign', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('classrooms_seats_id')->nullable();
        //     $table->string('class_id')->nullable();
        //     $table->string('student_id')->nullable();
        //     $table->string('seat_number')->nullable();
        //     $table->timestampsTz(precision: 0);
        // });

        // Schema::create('school_registry', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('region')->nullable();
        //     $table->string('division')->nullable();
        //     $table->string('district')->nullable();
        //     $table->string('school_id')->nullable();
        //     $table->string('school_name')->nullable();
        //     $table->string('school_address')->nullable();
        //     $table->string('school_year')->nullable();
        //     $table->string('head_name')->nullable();
        //     $table->string('head_position')->nullable();
        //     $table->timestampsTz(precision: 0);
        // });

        // Schema::create('student_final_grades', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('grade_level')->nullable();
        //     $table->string('sy')->nullable();
        //     $table->string('student_id')->nullable();
        //     $table->string('teacher_id')->nullable();
        //     $table->string('class_id')->nullable();
        //     $table->string('subject_id')->nullable();
        //     $table->string('subject_name')->nullable();
        //     $table->string('q1')->nullable();
        //     $table->string('q2')->nullable();
        //     $table->string('q3')->nullable();
        //     $table->string('q4')->nullable();
        //     $table->string('status')->nullable();
        //     $table->timestampsTz(precision: 0);
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('classrooms');
        // Schema::dropIfExists('school_class');
        // Schema::dropIfExists('classrooms_seats');
        // Schema::dropIfExists('classrooms_seats_assign');
    }
};
