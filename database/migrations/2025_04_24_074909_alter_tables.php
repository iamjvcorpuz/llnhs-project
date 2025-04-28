<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Query\Expression;

return new class extends Migration
{
    /**
     * Run the migrations.
     * https://laravel.com/docs/7.x/migrations#modifying-columns
     */
    public function up(): void
    {
        // Schema::table('events', function (Blueprint $table) {
        //     // $table->renameColumn('from', 'to'); Renaming Columns
        //     // $table->string('name', 50)->nullable()->change();  modify a column to be nullable:
        //     // $table->string('name', 50)->change(); // Updating Column Attributes
        //     // $table->dropColumn('votes'); // Dropping Columns
        //     // table->dropColumn(['votes', 'avatar', 'location']);
        //     // $table->enum('vote', [' 1', ' 2', ' 3', ' 4', ' 5'])->change();
        //     // $table->integer('votes');
        //     // $table->string('votes');
        //     // $table->boolean('votes');
        //     // $table->string('votes')->nullable(;
        //     // $table->renameColumn('facilitatior', 'facilitator');

        //     $table->string('qrcode')->nullable();
        //     $table->string('user_id')->nullable();
            
        // });

        // Schema::create('events', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('qrcode')->nullable();
        //     $table->string('user_id')->nullable();
        //     $table->string('type')->nullable();
        //     $table->string('event_name')->nullable();
        //     $table->string('facilitator')->nullable();
        //     $table->string('location')->nullable();
        //     $table->string('date')->nullable(); 
        //     $table->string('time_start')->nullable();
        //     $table->string('time_end')->nullable(); 
        //     $table->string('description')->nullable(); 
        //     $table->timestampsTz(precision: 0);
        // });  
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('events');
    }
};
