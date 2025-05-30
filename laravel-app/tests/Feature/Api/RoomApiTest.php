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

class RoomApiTest extends TestCase
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
    public function it_can_list_rooms()
    {
        $rooms = Room::factory()->count(3)->create();

        $response = $this->getJson('/api/rooms');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'room_number', 'price_per_night', 'quantity',
                        'available_quantity', 'status', 'hotel_id', 'room_type_id'
                    ]
                ],
                'links',
                'meta'
            ]);
    }

    /** @test */
    public function it_can_show_a_room()
    {
        $room = Room::factory()->create();

        $response = $this->getJson("/api/rooms/{$room->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $room->id,
                    'room_number' => $room->room_number,
                    'price_per_night' => (string) $room->price_per_night,
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_room()
    {
        $hotel = Hotel::factory()->create();
        $roomType = RoomType::factory()->create();
        $amenities = RoomAmenity::factory()->count(2)->create();
        
        $roomData = [
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'room_number' => '101',
            'price_per_night' => 199.99,
            'quantity' => 2,
            'available_quantity' => 2,
            'status' => 'available',
            'amenities' => $amenities->pluck('id')->toArray()
        ];
        
        $response = $this->postJson('/api/rooms', $roomData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Room created successfully',
                'data' => [
                    'room_number' => '101',
                    'price_per_night' => '199.99',
                    'status' => 'available'
                ]
            ]);

        $this->assertDatabaseHas('rooms', [
            'room_number' => '101',
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id
        ]);
        
        // Check if amenities were attached
        $roomId = $response->json('data.id');
        foreach ($amenities as $amenity) {
            $this->assertDatabaseHas('amenity_room', [
                'room_id' => $roomId,
                'amenity_id' => $amenity->id
            ]);
        }
    }

    /** @test */
    public function it_validates_required_fields_when_creating_room()
    {
        $response = $this->postJson('/api/rooms', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'hotel_id', 'room_type_id', 'room_number',
                'price_per_night', 'quantity', 'available_quantity', 'status'
            ]);
    }

    /** @test */
    public function it_can_update_a_room()
    {
        $room = Room::factory()->create();
        $newAmenities = RoomAmenity::factory()->count(2)->create();
        
        $updateData = [
            'room_number' => '201',
            'price_per_night' => 249.99,
            'status' => 'booked',
            'amenities' => $newAmenities->pluck('id')->toArray()
        ];

        $response = $this->putJson("/api/rooms/{$room->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room updated successfully',
                'data' => [
                    'room_number' => '201',
                    'price_per_night' => '249.99',
                    'status' => 'booked'
                ]
            ]);

        $this->assertDatabaseHas('rooms', [
            'id' => $room->id,
            'room_number' => '201',
            'price_per_night' => 249.99,
            'status' => 'booked'
        ]);
        
        // Check if amenities were synced
        $this->assertCount(2, $room->fresh()->amenities);
        $this->assertTrue($room->fresh()->amenities->contains($newAmenities[0]->id));
    }

    /** @test */
    public function it_can_delete_a_room()
    {
        $room = Room::factory()->create();

        $response = $this->deleteJson("/api/rooms/{$room->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('rooms', ['id' => $room->id]);
    }

    /** @test */
    public function it_can_list_rooms_by_hotel()
    {
        $hotel = Hotel::factory()->create();
        $otherHotel = Hotel::factory()->create();
        
        // Create rooms for both hotels
        $hotelRooms = Room::factory()->count(3)->create(['hotel_id' => $hotel->id]);
        $otherRooms = Room::factory()->count(2)->create(['hotel_id' => $otherHotel->id]);

        $response = $this->getJson("/api/hotels/{$hotel->id}/rooms");

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'room_number', 'hotel_id']
                ]
            ]);
    }

    /** @test */
    public function it_can_list_available_rooms()
    {
        $hotel = Hotel::factory()->create();
        
        // Create available rooms
        $availableRooms = Room::factory()->count(2)->create([
            'hotel_id' => $hotel->id,
            'available_quantity' => 1,
            'status' => 'available'
        ]);
        
        // Create unavailable room
        $unavailableRoom = Room::factory()->create([
            'hotel_id' => $hotel->id,
            'available_quantity' => 0,
            'status' => 'booked'
        ]);

        $response = $this->getJson("/api/hotels/{$hotel->id}/available-rooms");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'room_number', 'status', 'available_quantity']
                ]
            ]);
    }
}
