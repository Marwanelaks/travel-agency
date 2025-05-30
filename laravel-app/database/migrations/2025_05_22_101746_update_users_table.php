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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->after('email')->nullable();
            $table->string('avatar')->after('phone')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('avatar');
            $table->string('address')->after('status')->nullable();
            $table->string('city')->after('address')->nullable();
            $table->string('country')->after('city')->nullable();
            $table->string('postal_code')->after('country')->nullable();
            $table->date('date_of_birth')->after('postal_code')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->after('date_of_birth')->nullable();
            $table->text('bio')->after('gender')->nullable();
            $table->json('preferences')->after('bio')->nullable();
            $table->timestamp('last_login_at')->after('remember_token')->nullable();
            $table->string('last_login_ip')->after('last_login_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'avatar',
                'status',
                'address',
                'city',
                'country',
                'postal_code',
                'date_of_birth',
                'gender',
                'bio',
                'preferences',
                'last_login_at',
                'last_login_ip'
            ]);
        });
    }
};
