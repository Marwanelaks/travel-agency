<?php

namespace Tests\Feature\Api;

use App\Models\RoomAmenity;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoomAmenityApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user and authenticate with Sanctum
        $user = \App\Models\User::factory()->create();
        \Laravel\Sanctum\Sanctum::actingAs($user, ['*']);
    }

    /** @test */
    public function it_can_list_room_amenities()
    {
        $amenities = RoomAmenity::factory()->count(3)->create();

        $response = $this->getJson('/api/room-amenities');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'icon', 'created_at']
                ]
            ]);
    }

    /** @test */
    public function it_can_show_a_room_amenity()
    {
        $amenity = RoomAmenity::factory()->create();

        $response = $this->getJson("/api/room-amenities/{$amenity->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $amenity->id,
                    'name' => $amenity->name,
                    'icon' => $amenity->icon,
                    'created_at' => $amenity->created_at->toJson(),
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_room_amenity()
    {
        $room = Room::factory()->create();
        $amenity = RoomAmenity::factory()->create();
        $amenityData = [
            'room_id' => $room->id,
            'amenity_id' => $amenity->id,
        ];

        $response = $this->postJson('/api/room-amenities', $amenityData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Room amenity created successfully',
                'data' => [
                    'room_id' => $room->id,
                    'amenity_id' => $amenity->id,
                ]
            ]);

        $this->assertDatabaseHas('room_amenity', [
            'room_id' => $room->id,
            'amenity_id' => $amenity->id,
        ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_amenity()
    {
        $response = $this->postJson('/api/room-amenities', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_validates_name_must_be_unique()
    {
        // Create a room amenity
        RoomAmenity::factory()->create([
            'name' => 'Ocean View',
            'icon' => 'test-icon'
        ]);

        // Try to create another room amenity with the same name
        $response = $this->postJson('/api/room-amenities', [
            'name' => 'Ocean View',
            'icon' => 'another-icon',
            'room_id' => Room::factory()->create()->id,
            'amenity_id' => RoomAmenity::factory()->create()->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_can_update_a_room_amenity()
    {
        $amenity = RoomAmenity::factory()->create([
            'name' => 'Original Amenity',
            'description' => 'Original description',
            'icon' => 'original-icon'
        ]);

        $updateData = [
            'name' => 'Updated Amenity',
            'description' => 'Updated description',
            'icon' => 'updated-icon'
        ];

        $response = $this->putJson("/api/room-amenities/{$amenity->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room amenity updated successfully',
                'data' => [
                    'name' => 'Updated Amenity',
                    'description' => 'Updated description',
                    'icon' => 'updated-icon'
                ]
            ]);

        $this->assertDatabaseHas('room_amenities', [
            'id' => $amenity->id,
            'name' => 'Updated Amenity',
            'description' => 'Updated description',
            'icon' => 'updated-icon'
        ]);
    }

    /** @test */
    public function it_can_delete_a_room_amenity()
    {
        $amenity = RoomAmenity::factory()->create();

        $response = $this->deleteJson("/api/room-amenities/{$amenity->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('room_amenities', ['id' => $amenity->id]);
    }

    /** @test */
    public function it_can_list_amenities_for_a_room()
    {
        $room = Room::factory()->create();
        $amenities = RoomAmenity::factory()->count(3)->create();
        $room->amenities()->attach($amenities->pluck('id'));

        $response = $this->getJson("/api/rooms/{$room->id}");

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data.amenities')
            ->assertJsonStructure([
                'data' => [
                    'amenities' => [
                        '*' => ['id', 'name', 'icon']
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_can_list_amenities_for_a_room_type()
    {
        $roomType = RoomType::factory()->create();
        $amenities = RoomAmenity::factory()->count(2)->create();
        $roomType->amenities()->attach($amenities->pluck('id'));

        // Refresh the room type to load the relationships
        $roomType->load('amenities');

        $response = $this->getJson("/api/room-types/{$roomType->id}?include=amenities");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data.amenities')
            ->assertJsonStructure([
                'data' => [
                    'amenities' => [
                        '*' => ['id', 'name', 'icon']
                    ]
                ]
            ]);
            
        // Verify the amenities are correctly attached
        $this->assertCount(2, $roomType->amenities);
        $this->assertEquals(
            $amenities->pluck('id')->sort()->values(),
            $roomType->amenities->pluck('id')->sort()->values()
        );
    }
}
