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
        // Create hotels table
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country');
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->integer('star_rating')->default(3);
            $table->time('check_in_time')->default('14:00:00');
            $table->time('check_out_time')->default('12:00:00');
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['draft', 'published', 'unpublished'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        // Create room_types table
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->integer('base_occupancy')->default(2);
            $table->integer('max_occupancy')->default(2);
            $table->integer('max_extra_beds')->default(0);
            $table->decimal('extra_bed_charge', 10, 2)->default(0);
            $table->json('amenities')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Create rooms table
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_type_id')->constrained()->onDelete('cascade');
            $table->string('room_number');
            $table->string('floor')->nullable();
            $table->decimal('price_per_night', 10, 2);
            $table->integer('quantity')->default(1);
            $table->integer('available_quantity')->default(1);
            $table->integer('size_sqm')->nullable();
            $table->integer('size_sqft')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['available', 'booked', 'maintenance'])->default('available');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['hotel_id', 'room_number']);
        });

        // Create room_amenities pivot table
        Schema::create('room_amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        // Create room_amenity pivot table
        Schema::create('room_room_amenity', function (Blueprint $table) {
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_amenity_id')->constrained('room_amenities')->onDelete('cascade');
            $table->primary(['room_id', 'room_amenity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_room_amenity');
        Schema::dropIfExists('room_amenities');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('room_types');
        Schema::dropIfExists('hotels');
    }
};
