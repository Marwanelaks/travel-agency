<?php

namespace Tests\Feature\Api;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\RoomAmenity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HotelApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user and authenticate with Sanctum
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
    }

    /** @test */
    public function it_can_list_hotels()
    {
        $hotels = Hotel::factory()->count(3)->create();

        $response = $this->getJson('/api/hotels');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'name', 'slug', 'description', 'star_rating', 
                        'address', 'city', 'country', 'status', 'featured'
                    ]
                ],
                'links',
                'meta'
            ]);
    }

    /** @test */
    public function it_can_show_a_hotel()
    {
        $hotel = Hotel::factory()->create();

        $response = $this->getJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $hotel->id,
                    'name' => $hotel->name,
                    'slug' => $hotel->slug,
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_hotel()
    {
        $hotelData = Hotel::factory()->make()->toArray();
        
        $response = $this->postJson('/api/hotels', $hotelData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Hotel created successfully',
                'data' => [
                    'name' => $hotelData['name'],
                    'city' => $hotelData['city'],
                    'country' => $hotelData['country'],
                    'status' => 'draft'
                ]
            ]);

        $this->assertDatabaseHas('hotels', [
            'name' => $hotelData['name'],
            'city' => $hotelData['city']
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_hotel()
    {
        $response = $this->postJson('/api/hotels', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'address', 'city', 'country']);
    }

    /** @test */
    public function it_can_update_a_hotel()
    {
        $hotel = Hotel::factory()->create();
        $updateData = [
            'name' => 'Updated Hotel Name',
            'city' => 'New City',
            'country' => 'New Country',
            'status' => 'published'
        ];

        $response = $this->putJson("/api/hotels/{$hotel->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Hotel updated successfully',
                'data' => [
                    'name' => 'Updated Hotel Name',
                    'city' => 'New City',
                    'status' => 'published'
                ]
            ]);

        $this->assertDatabaseHas('hotels', [
            'id' => $hotel->id,
            'name' => 'Updated Hotel Name',
            'city' => 'New City',
            'status' => 'published'
        ]);
    }

    /** @test */
    public function it_can_delete_a_hotel()
    {
        $hotel = Hotel::factory()->create();

        $response = $this->deleteJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted('hotels', ['id' => $hotel->id]);
    }

    /** @test */
    public function it_can_list_featured_hotels()
    {
        // Create featured hotels
        $featuredHotels = Hotel::factory()->count(3)->create([
            'featured' => true,
            'status' => 'published'
        ]);
        
        // Create non-featured hotels
        Hotel::factory()->count(2)->create([
            'featured' => false,
            'status' => 'published'
        ]);

        $response = $this->getJson('/api/hotels/featured');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'featured']
                ]
            ]);
    }

    /** @test */
    public function it_can_search_hotels()
    {
        $hotel1 = Hotel::factory()->create([
            'name' => 'Beach Resort',
            'city' => 'Miami',
            'country' => 'USA',
            'star_rating' => 5,
            'status' => 'published'
        ]);

        $hotel2 = Hotel::factory()->create([
            'name' => 'Mountain Lodge',
            'city' => 'Denver',
            'country' => 'USA',
            'star_rating' => 4,
            'status' => 'published'
        ]);

        // Search by city
        $response = $this->getJson('/api/hotels/search?city=Miami');
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.city', 'Miami');

        // Search by minimum rating
        $response = $this->getJson('/api/hotels/search?min_rating=5');
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.star_rating', 5);
    }
}
