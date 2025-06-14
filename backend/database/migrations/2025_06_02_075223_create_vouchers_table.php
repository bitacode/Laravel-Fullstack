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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('unique_code')->unique();
            $table->enum('discount_type', ['percentage', 'fixed']);
            $table->unsignedInteger('discount_value');
            $table->unsignedInteger('min_eligible_price');
            $table->date('valid_from');
            $table->date('valid_until');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
