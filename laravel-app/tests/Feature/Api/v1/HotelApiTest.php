<?php

namespace Tests\Feature\Api\v1;

use Tests\TestCase;
use App\Models\Hotel;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HotelApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_hotels()
    {
        // Create test hotels
        $hotels = Hotel::factory()->count(3)->create();

        // Make authenticated API request
        $response = $this->authenticatedApiRequest('GET', '/hotels');

        // Assert response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'short_description',
                        'address',
                        'city',
                        'state',
                        'country',
                        'postal_code',
                        'latitude',
                        'longitude',
                        'full_address',
                        'phone',
                        'email',
                        'website',
                        'star_rating',
                        'check_in_time',
                        'check_out_time',
                        'amenities',
                        'images',
                        'main_image',
                        'status',
                        'featured',
                        'created_at',
                        'updated_at'
                    ]
                ],
                'links' => [
                    'first',
                    'last',
                    'prev',
                    'next',
                ],
                'meta' => [
                    'current_page',
                    'from',
                    'last_page',
                    'path',
                    'per_page',
                    'to',
                    'total',
                ],
            ]);
    }

    /** @test */
    public function it_can_show_a_hotel()
    {
        // Create a test hotel
        $hotel = $this->createTestHotel();

        // Make API request
        $response = $this->apiRequest('GET', "/hotels/{$hotel->id}");

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $hotel->id,
                    'name' => $hotel->name,
                    'address' => $hotel->address,
                    'city' => $hotel->city,
                    'state' => $hotel->state,
                    'zip_code' => $hotel->zip_code,
                    'website' => $hotel->website,
                    'phone' => $hotel->phone,
                    'email' => $hotel->email,
                    'description' => $hotel->description,
                    'star_rating' => $hotel->star_rating,
                ]
            ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_hotel()
    {
        // Make API request with empty data
        $response = $this->authenticatedApiRequest('POST', '/hotels', []);

        // Assert validation errors
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'address',
                'city',
                'state',
                'zip_code',
                'email',
                'star_rating',
            ]);
    }

    /** @test */
    public function it_can_create_a_hotel()
    {
        // Get valid hotel data
        $hotelData = $this->getValidHotelData();

        // Make API request
        $response = $this->authenticatedApiRequest('POST', '/hotels', $hotelData);

        // Assert response
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Hotel created successfully',
                'data' => [
                    'name' => $hotelData['name'],
                    'address' => $hotelData['address'],
                    'city' => $hotelData['city'],
                    'state' => $hotelData['state'],
                    'zip_code' => $hotelData['zip_code'],
                    'website' => $hotelData['website'],
                    'phone' => $hotelData['phone'],
                    'email' => $hotelData['email'],
                    'description' => $hotelData['description'],
                    'star_rating' => $hotelData['star_rating'],
                ]
            ]);

        // Assert database has the hotel
        $this->assertDatabaseHas('hotels', [
            'name' => $hotelData['name'],
            'email' => $hotelData['email'],
        ]);
    }

    /** @test */
    public function it_can_update_a_hotel()
    {
        // Create a test hotel
        $hotel = $this->createTestHotel();

        // Update data
        $updateData = [
            'name' => 'Updated Hotel Name',
            'star_rating' => 5,
        ];

        // Make API request
        $response = $this->authenticatedApiRequest('PUT', "/hotels/{$hotel->id}", $updateData);

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Hotel updated successfully',
                'data' => [
                    'id' => $hotel->id,
                    'name' => $updateData['name'],
                    'star_rating' => $updateData['star_rating'],
                ]
            ]);

        // Assert database was updated
        $this->assertDatabaseHas('hotels', [
            'id' => $hotel->id,
            'name' => $updateData['name'],
            'star_rating' => $updateData['star_rating'],
        ]);
    }

    /** @test */
    public function it_can_delete_a_hotel()
    {
        // Create a test hotel
        $hotel = $this->createTestHotel();

        // Make API request
        $response = $this->authenticatedApiRequest('DELETE', "/hotels/{$hotel->id}");

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Hotel deleted successfully'
            ]);

        // Assert hotel was soft deleted
        $this->assertSoftDeleted('hotels', [
            'id' => $hotel->id
        ]);
    }

    /** @test */
    public function it_prevents_unauthorized_access()
    {
        // Create a test hotel
        $hotel = $this->createTestHotel();

        // Try to access protected endpoints without authentication
        $this->apiRequest('POST', '/hotels', [])->assertStatus(401);
        $this->apiRequest('PUT', "/hotels/{$hotel->id}", [])->assertStatus(401);
        $this->apiRequest('DELETE', "/hotels/{$hotel->id}")->assertStatus(401);
    }

    /** @test */
    public function it_validates_star_rating_range()
    {
        // Try to create a hotel with invalid star rating
        $response = $this->authenticatedApiRequest('POST', '/hotels', [
            'name' => 'Invalid Star Rating Hotel',
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'Test State',
            'zip_code' => '12345',
            'email' => 'test@example.com',
            'star_rating' => 6, // Invalid: should be between 1 and 5
        ]);

        // Assert validation error
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['star_rating']);
    }
}
