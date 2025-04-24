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
        Schema::table('events', function (Blueprint $table) {
            // $table->renameColumn('from', 'to'); Renaming Columns
            // $table->string('name', 50)->nullable()->change();  modify a column to be nullable:
            // $table->string('name', 50)->change(); // Updating Column Attributes
            // $table->dropColumn('votes'); // Dropping Columns
            // table->dropColumn(['votes', 'avatar', 'location']);
            // $table->enum('vote', [' 1', ' 2', ' 3', ' 4', ' 5'])->change();
            $table->renameColumn('facilitatior', 'facilitator');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
