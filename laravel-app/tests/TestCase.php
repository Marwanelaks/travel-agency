<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseLaravelTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\Traits\TestHelpers;

abstract class TestCase extends BaseLaravelTestCase
{
    use CreatesApplication, RefreshDatabase, WithFaker, TestHelpers;
    
    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;
    
    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';
    
    /**
     * The base API URL.
     *
     * @var string
     */
    protected $apiBaseUrl = 'http://localhost/api';
    
    /**
     * The authenticated user instance.
     *
     * @var \App\Models\User
     */
    protected $user;
    
    /**
     * The admin user instance.
     *
     * @var \App\Models\User
     */
    protected $admin;
    
    /**
     * Set up the test case.
     *
     * @return void
     */
    /**
     * Set up the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Reset cached roles and permissions
        $this->app->make(PermissionRegistrar::class)->forgetCachedPermissions();
        
        // Clear all tables
        $tables = \DB::select('SELECT name FROM sqlite_master WHERE type="table" AND name!="migrations"');
        \DB::statement('PRAGMA foreign_keys = OFF');
        
        foreach ($tables as $table) {
            if ($table->name === 'sqlite_sequence') {
                continue;
            }
            \DB::table($table->name)->truncate();
        }
        
        \DB::statement('PRAGMA foreign_keys = ON');
        
        // Run migrations
        $this->artisan('migrate');
        
        // Create admin role if it doesn't exist
        if (!Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin']);
        }
        
        // Create test users
        $this->user = $this->createRegularUser();
        $this->admin = $this->createAdminUser();
        
        // Enable exception handling to see the actual errors
        $this->withoutExceptionHandling();
    }
    
    /**
     * Make an API request.
     *
     * @param  string  $method
     * @param  string  $uri
     * @param  array  $data
     * @param  array  $headers
     * @return \Illuminate\Testing\TestResponse
     */
    protected function apiRequest($method, $uri, array $data = [], array $headers = [])
    {
        $headers = array_merge([
            'Accept' => 'application/json',
        ], $headers);
        
        return $this->withHeaders($headers)->json($method, $this->apiBaseUrl . $uri, $data);
    }
    
    /**
     * Make an authenticated API request.
     *
     * @param  string  $method
     * @param  string  $uri
     * @param  array  $data
     * @param  array  $headers
     * @param  \App\Models\User|null  $user
     * @return \Illuminate\Testing\TestResponse
     */
    protected function authenticatedApiRequest($method, $uri, array $data = [], array $headers = [], $user = null)
    {
        $user = $user ?: $this->user;
        
        return $this->actingAs($user, 'sanctum')->apiRequest($method, $uri, $data, $headers);
    }
}
