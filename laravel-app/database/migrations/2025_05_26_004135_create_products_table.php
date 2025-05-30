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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // hotel, flight, sport, entertainment, package, car_rental, insurance, cruise
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('location')->nullable();
            $table->decimal('rating', 3, 1)->nullable();
            $table->string('image')->nullable();
            $table->integer('capacity')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            // JSON fields for different product types
            $table->json('hotel_details')->nullable();
            $table->json('flight_details')->nullable();
            $table->json('sport_details')->nullable();
            $table->json('entertainment_details')->nullable();
            $table->json('package_details')->nullable();
            $table->json('car_details')->nullable();
            $table->json('insurance_details')->nullable();
            $table->json('cruise_details')->nullable();
            
            // Common fields
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
