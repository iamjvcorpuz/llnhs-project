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
        Schema::create('offline_sync_metadata', function (Blueprint $table) {
            $table->id();
            $table->string('model_class');
            $table->string('key');
            $table->text('value')->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate metadata entries
            $table->unique(['model_class', 'key']);
            $table->index('model_class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offline_sync_metadata');
    }
};