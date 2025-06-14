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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name')->unique();
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->enum('bank_name_primary', ['BRI', 'BCA', 'Mandiri', 'BNI']);
            $table->enum('bank_name_secondary', ['BRI', 'BCA', 'Mandiri', 'BNI'])->nullable();
            $table->string('bank_account_primary');
            $table->string('bank_account_secondary')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
