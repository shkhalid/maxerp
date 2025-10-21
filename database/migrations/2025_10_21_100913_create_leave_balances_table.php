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
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('leave_type', ['vacation', 'sick', 'personal']);
            $table->integer('total_days');
            $table->integer('used_days')->default(0);
            $table->integer('remaining_days');
            $table->integer('year');
            $table->timestamps();

            // Ensure unique balance per user, leave type, and year
            $table->unique(['user_id', 'leave_type', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
