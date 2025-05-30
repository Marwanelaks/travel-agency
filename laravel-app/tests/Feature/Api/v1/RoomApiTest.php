<?php

namespace Tests\Feature\Api\v1;

use Tests\TestCase;
use App\Models\Room;
use App\Models\Hotel;
use App\Models\RoomType;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_rooms()
    {
        // Create test rooms
        $roomType = $this->createTestRoomType();
        $hotel = $this->createTestHotel();
        $rooms = Room::factory()->count(3)->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel->id,
        ]);

        // Make API request
        $response = $this->apiRequest('GET', '/rooms');

        // Assert response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'hotel_id',
                        'room_type_id',
                        'room_number',
                        'floor',
                        'status',
                        'created_at',
                        'updated_at',
                        'hotel' => [
                            'id',
                            'name',
                        ],
                        'room_type' => [
                            'id',
                            'name',
                        ]
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
    public function it_can_show_a_room()
    {
        // Create test data
        $roomType = $this->createTestRoomType();
        $hotel = $this->createTestHotel();
        $room = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel->id,
            'room_number' => '101',
            'floor' => 1,
            'status' => 'available',
        ]);

        // Make API request
        $response = $this->apiRequest('GET', "/rooms/{$room->id}");

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $room->id,
                    'hotel_id' => $hotel->id,
                    'room_type_id' => $roomType->id,
                    'room_number' => '101',
                    'floor' => 1,
                    'status' => 'available',
                    'hotel' => [
                        'id' => $hotel->id,
                        'name' => $hotel->name,
                    ],
                    'room_type' => [
                        'id' => $roomType->id,
                        'name' => $roomType->name,
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_room()
    {
        // Make API request with empty data
        $response = $this->authenticatedApiRequest('POST', '/rooms', []);

        // Assert validation errors
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'hotel_id',
                'room_type_id',
                'room_number',
                'floor',
                'status',
            ]);
    }

    /** @test */
    public function it_validates_room_number_is_unique_per_hotel()
    {
        // Create a test room
        $roomType = $this->createTestRoomType();
        $hotel = $this->createTestHotel();
        $existingRoom = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel->id,
            'room_number' => '101',
        ]);

        // Try to create another room with the same number in the same hotel
        $response = $this->authenticatedApiRequest('POST', '/rooms', [
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'room_number' => '101', // Duplicate room number
            'floor' => 1,
            'status' => 'available',
        ]);

        // Assert validation error
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['room_number']);
    }

    /** @test */
    public function it_can_create_a_room()
    {
        // Create test data
        $roomType = $this->createTestRoomType();
        $hotel = $this->createTestHotel();
        
        // Create an admin user for the test
        $admin = $this->createAdminUser();
        $this->actingAs($admin);

        // Room data
        $roomData = [
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'room_number' => '201',
            'floor' => 2,
            'status' => 'available',
            'price_per_night' => 100.00,
            'quantity' => 1,
            'available_quantity' => 1,
        ];

        // Make authenticated API request
        $response = $this->postJson('/api/rooms', $roomData, [
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $admin->createToken('test-token')->plainTextToken,
        ]);

        // Assert response
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'room_number',
                    'floor',
                    'status',
                    'price_per_night',
                    'quantity',
                    'available_quantity',
                    'hotel' => ['id', 'name'],
                    'room_type' => ['id', 'name'],
                    'amenities'
                ]
            ])
            ->assertJson([
                'message' => 'Room created successfully',
                'data' => [
                    'room_number' => $roomData['room_number'],
                    'floor' => $roomData['floor'],
                    'status' => $roomData['status'],
                    'price_per_night' => number_format($roomData['price_per_night'], 2, '.', ''),
                    'quantity' => $roomData['quantity'],
                    'available_quantity' => $roomData['available_quantity'],
                ]
            ]);

        // Assert database has the room
        $this->assertDatabaseHas('rooms', [
            'room_number' => $roomData['room_number'],
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'floor' => $roomData['floor'],
            'status' => $roomData['status'],
        ]);
    }

    /** @test */
    public function it_can_update_a_room()
    {
        // Create test data
        $roomType = $this->createTestRoomType();
        $newRoomType = $this->createTestRoomType(['name' => 'Deluxe Room']);
        $hotel = $this->createTestHotel();
        
        // Create a room to update
        $room = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel->id,
            'room_number' => '101',
            'floor' => 1,
            'status' => 'available',
        ]);

        // Update data
        $updateData = [
            'room_type_id' => $newRoomType->id,
            'room_number' => '102',
            'floor' => 1,
            'status' => 'maintenance',
        ];

        // Make API request
        $response = $this->authenticatedApiRequest('PUT', "/rooms/{$room->id}", $updateData);

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room updated successfully',
                'data' => [
                    'id' => $room->id,
                    'room_number' => $updateData['room_number'],
                    'floor' => $updateData['floor'],
                    'status' => $updateData['status'],
                    'room_type' => [
                        'id' => $newRoomType->id,
                        'name' => $newRoomType->name,
                    ]
                ]
            ]);

        // Assert database was updated
        $this->assertDatabaseHas('rooms', [
            'id' => $room->id,
            'room_number' => $updateData['room_number'],
            'room_type_id' => $updateData['room_type_id'],
            'status' => $updateData['status'],
        ]);
    }

    /** @test */
    public function it_can_delete_a_room()
    {
        // Create test data
        $roomType = $this->createTestRoomType();
        $hotel = $this->createTestHotel();
        $room = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel->id,
        ]);

        // Make API request
        $response = $this->authenticatedApiRequest('DELETE', "/rooms/{$room->id}");

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room deleted successfully'
            ]);

        // Assert room was soft deleted
        $this->assertSoftDeleted('rooms', [
            'id' => $room->id
        ]);
    }

    /** @test */
    public function it_prevents_unauthorized_access()
    {
        // Create a test room
        $roomType = $this->createTestRoomType();
        $hotel = $this->createTestHotel();
        $room = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel->id,
        ]);

        // Try to access protected endpoints without authentication
        $this->apiRequest('POST', '/rooms', [])->assertStatus(401);
        $this->apiRequest('PUT', "/rooms/{$room->id}", [])->assertStatus(401);
        $this->apiRequest('DELETE', "/rooms/{$room->id}")->assertStatus(401);
    }

    /** @test */
    public function it_can_filter_rooms_by_hotel()
    {
        // Create test data
        $roomType = $this->createTestRoomType();
        $hotel1 = $this->createTestHotel(['name' => 'Hotel A']);
        $hotel2 = $this->createTestHotel(['name' => 'Hotel B']);
        
        // Create rooms in different hotels
        $room1 = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel1->id,
            'room_number' => '101',
        ]);
        
        $room2 = Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $hotel2->id,
            'room_number' => '201',
        ]);

        // Filter by hotel_id
        $response = $this->apiRequest('GET', "/rooms?hotel_id={$hotel1->id}");

        // Assert only rooms from hotel1 are returned
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'id' => $room1->id,
                'room_number' => '101',
                'hotel' => [
                    'id' => $hotel1->id,
                    'name' => 'Hotel A',
                ]
            ])
            ->assertJsonMissing([
                'id' => $room2->id
            ]);
    }
}
