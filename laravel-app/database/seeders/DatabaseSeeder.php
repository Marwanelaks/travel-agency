<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\HotelRoomTypeSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\OrderSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolePermissionSeeder::class,
            HotelRoomTypeSeeder::class,
            ProductSeeder::class,
            UserSeeder::class, // Always seed superadmin and roles using UserSeeder
            OrderSeeder::class, // Seed orders after users to ensure proper relationships
        ]);

    }
}

