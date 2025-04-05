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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        // Schema::dropIfExists('classrooms');
        // Schema::dropIfExists('school_class');
    }
};
