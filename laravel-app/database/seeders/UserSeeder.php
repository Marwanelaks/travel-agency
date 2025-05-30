<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $user = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'), // Change for production!
                'status' => 'active', // Make sure the users table has this column
            ]
        );
        // Assign SuperAdmin role if using spatie/laravel-permission
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('SuperAdmin');
        }
    }
}
