<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Users
            'view users',
            'create users',
            'edit users',
            'delete users',
            'manage user roles',
            
            // Hotels
            'view hotels',
            'create hotels',
            'edit hotels',
            'delete hotels',
            'manage hotel settings',
            
            // Rooms
            'view rooms',
            'create rooms',
            'edit rooms',
            'delete rooms',
            'manage room types',
            'manage room amenities',
            
            // Bookings
            'view bookings',
            'create bookings',
            'edit bookings',
            'cancel bookings',
            'manage booking settings',

            // Orders
            'view orders',
            'create orders',
            'approve orders',
            'deliver orders',
            'cancel orders',
            
            // Reports
            'view reports',
            'export reports',
            
            // System
            'manage system settings',
            'view system logs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign created permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $superAdminRole->givePermissionTo(Permission::all());

        $sellerRole = Role::firstOrCreate(['name' => 'Seller']);
        $sellerRole->givePermissionTo([
            'view users', 'create users', 'edit users', 'delete users', // manage own clients
            'manage user roles',
            'view hotels', 'create hotels', 'edit hotels', 'delete hotels', // manage own products
            'view rooms', 'create rooms', 'edit rooms', 'delete rooms',
            'view bookings', 'create bookings', 'edit bookings', 'cancel bookings',
            'manage room types', 'manage room amenities',
            'manage hotel settings',
            // Orders
            'view orders', 'approve orders', 'deliver orders',
        ]);

        $randomBuyerRole = Role::firstOrCreate(['name' => 'Random buyer']);
        $randomBuyerRole->givePermissionTo([
            'view hotels', 'view rooms', 'create bookings', 'view bookings',
            // Orders
            'view orders', 'create orders', 'cancel orders',
        ]);

        // Legacy roles for backward compatibility
        $adminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        $adminRole->givePermissionTo(Permission::all());

        $managerRole = Role::firstOrCreate(['name' => 'Hotel Manager']);
        $managerRole->givePermissionTo([
            'view hotels', 'create hotels', 'edit hotels', 'delete hotels',
            'view rooms', 'create rooms', 'edit rooms', 'delete rooms',
            'view bookings', 'create bookings', 'edit bookings', 'cancel bookings',
            'manage room types', 'manage room amenities',
        ]);

        $staffRole = Role::firstOrCreate(['name' => 'Staff']);
        $staffRole->givePermissionTo([
            'view hotels', 'view rooms', 'view bookings', 
            'create bookings', 'edit bookings', 'cancel bookings',
        ]);

        $customerRole = Role::firstOrCreate(['name' => 'Customer']);
        $customerRole->givePermissionTo([
            'view hotels', 'view rooms', 'create bookings', 'view bookings',
        ]);
    }
}
