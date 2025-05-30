<?php

namespace Tests\Traits;

use App\Models\User;
use App\Models\Hotel;
use App\Models\RoomType;
use App\Models\RoomAmenity;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

trait TestHelpers
{
    /**
     * Create an admin user with all permissions
     */
    protected function createAdminUser()
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
        // Create a user with a unique email
        $user = User::factory()->create([
            'name' => 'Admin User ' . uniqid(),
            'email' => 'admin_' . uniqid() . '@example.com',
            'password' => bcrypt('password')
        ]);
        
        // Assign admin role
        $user->assignRole($adminRole);
        
        return $user;
    }
    
    /**
     * Create a regular user with basic permissions
     */
    protected function createRegularUser()
    {
        return User::factory()->create([
            'name' => 'Regular User ' . uniqid(),
            'email' => 'user_' . uniqid() . '@example.com',
            'password' => bcrypt('password')
        ]);
    }
    
    /**
     * Create test hotel
     */
    protected function createTestHotel($attributes = [])
    {
        return Hotel::factory()->create(array_merge([
            'name' => 'Test Hotel',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'zip_code' => '12345',
            'website' => 'https://testhotel.com',
            'phone' => '123-456-7890',
            'email' => 'test@testhotel.com',
            'description' => 'A test hotel',
            'star_rating' => 4,
        ], $attributes));
    }
    
    /**
     * Create test room type
     */
    protected function createTestRoomType($attributes = [])
    {
        return RoomType::factory()->create(array_merge([
            'name' => 'Test Room Type',
            'slug' => 'test-room-type',
            'description' => 'A test room type',
            'base_occupancy' => 2,
            'max_occupancy' => 4,
            'max_extra_beds' => 2,
            'extra_bed_charge' => 25.00,
            'base_price' => 100.00,
        ], $attributes));
    }
    
    /**
     * Create test room amenity
     */
    protected function createTestRoomAmenity($attributes = [])
    {
        return RoomAmenity::factory()->create(array_merge([
            'name' => 'Test Amenity',
            'description' => 'A test amenity',
            'icon' => 'test-icon',
        ], $attributes));
    }
    
    /**
     * Get valid hotel data
     */
    protected function getValidHotelData($overrides = [])
    {
        return array_merge([
            'name' => 'New Test Hotel',
            'address' => '456 New Test St',
            'city' => 'New Test City',
            'state' => 'New Test State',
            'zip_code' => '54321',
            'website' => 'https://newtesthotel.com',
            'phone' => '987-654-3210',
            'email' => 'info@newtesthotel.com',
            'description' => 'A new test hotel',
            'star_rating' => 4,
        ], $overrides);
    }
    
    /**
     * Get valid room type data
     */
    protected function getValidRoomTypeData($overrides = [])
    {
        return array_merge([
            'name' => 'New Test Room Type',
            'slug' => 'new-test-room-type',
            'description' => 'A new test room type',
            'base_occupancy' => 2,
            'max_occupancy' => 4,
            'max_extra_beds' => 2,
            'extra_bed_charge' => 20.00,
            'base_price' => 90.00,
        ], $overrides);
    }
}
