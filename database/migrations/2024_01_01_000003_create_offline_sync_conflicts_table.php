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
        Schema::create('offline_sync_conflicts', function (Blueprint $table) {
            $table->id();
            $table->string('model_class');
            $table->unsignedBigInteger('model_id');
            $table->enum('conflict_type', ['update_conflict', 'delete_conflict', 'data_mismatch']);
            $table->json('offline_data')->nullable();
            $table->json('online_data')->nullable();
            $table->timestamp('offline_updated_at')->nullable();
            $table->timestamp('online_updated_at')->nullable();
            $table->enum('status', ['pending', 'resolved', 'ignored'])->default('pending');
            $table->string('resolution_strategy')->nullable();
            $table->json('resolved_data')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['model_class', 'model_id']);
            $table->index(['status', 'created_at']);
            $table->index('conflict_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offline_sync_conflicts');
    }
};