<?php

namespace Tests\Feature\Api\v1;

use Tests\TestCase;
use App\Models\RoomType;
use App\Models\RoomAmenity;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomTypeApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_room_types()
    {
        // Create test room types
        $roomTypes = RoomType::factory()->count(3)->create();

        // Make API request
        $response = $this->apiRequest('GET', '/room-types');

        // Assert response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'description',
                        'base_occupancy',
                        'max_occupancy',
                        'max_extra_beds',
                        'extra_bed_charge',
                        'base_price',
                        'created_at',
                        'updated_at',
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
    public function it_can_show_a_room_type()
    {
        // Create a test room type
        $roomType = $this->createTestRoomType();

        // Make API request
        $response = $this->apiRequest('GET', "/room-types/{$roomType->id}");

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'slug' => $roomType->slug,
                    'description' => $roomType->description,
                    'base_occupancy' => $roomType->base_occupancy,
                    'max_occupancy' => $roomType->max_occupancy,
                    'max_extra_beds' => $roomType->max_extra_beds,
                    'extra_bed_charge' => (string) $roomType->extra_bed_charge,
                    'base_price' => (string) $roomType->base_price,
                ]
            ]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_room_type()
    {
        // Make API request with empty data
        $response = $this->authenticatedApiRequest('POST', '/room-types', []);

        // Assert validation errors
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'base_occupancy',
                'max_occupancy',
                'max_extra_beds',
                'extra_bed_charge',
                'base_price',
            ]);
    }

    /** @test */
    public function it_validates_max_occupancy_greater_than_base()
    {
        // Test data with max_occupancy less than base_occupancy
        $roomTypeData = $this->getValidRoomTypeData([
            'base_occupancy' => 3,
            'max_occupancy' => 2, // Invalid: should be >= base_occupancy
        ]);

        // Make API request
        $response = $this->authenticatedApiRequest('POST', '/room-types', $roomTypeData);

        // Assert validation error
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['max_occupancy']);
    }

    /** @test */
    public function it_can_create_a_room_type()
    {
        // Create some amenities
        $amenities = RoomAmenity::factory()->count(3)->create();
        $amenityIds = $amenities->pluck('id')->toArray();

        // Get valid room type data
        $roomTypeData = $this->getValidRoomTypeData([
            'amenities' => $amenityIds,
        ]);

        // Make API request
        $response = $this->authenticatedApiRequest('POST', '/room-types', $roomTypeData);

        // Assert response
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Room type created successfully',
                'data' => [
                    'name' => $roomTypeData['name'],
                    'slug' => $roomTypeData['slug'],
                    'description' => $roomTypeData['description'],
                    'base_occupancy' => $roomTypeData['base_occupancy'],
                    'max_occupancy' => $roomTypeData['max_occupancy'],
                    'max_extra_beds' => $roomTypeData['max_extra_beds'],
                    'extra_bed_charge' => (string) $roomTypeData['extra_bed_charge'],
                    'base_price' => (string) $roomTypeData['base_price'],
                ]
            ]);

        // Assert database has the room type
        $this->assertDatabaseHas('room_types', [
            'name' => $roomTypeData['name'],
            'slug' => $roomTypeData['slug'],
        ]);

        // Assert amenities were attached
        $roomType = RoomType::where('slug', $roomTypeData['slug'])->first();
        $this->assertCount(count($amenityIds), $roomType->amenities);
        foreach ($amenityIds as $amenityId) {
            $this->assertDatabaseHas('room_type_amenity', [
                'room_type_id' => $roomType->id,
                'amenity_id' => $amenityId,
            ]);
        }
    }

    /** @test */
    public function it_can_update_a_room_type()
    {
        // Create a test room type
        $roomType = $this->createTestRoomType();
        
        // Create some amenities
        $existingAmenities = RoomAmenity::factory()->count(2)->create();
        $newAmenity = RoomAmenity::factory()->create();
        
        // Attach some amenities initially
        $roomType->amenities()->attach($existingAmenities->pluck('id'));

        // Update data
        $updateData = [
            'name' => 'Updated Room Type',
            'base_occupancy' => 3,
            'amenities' => [$existingAmenities[0]->id, $newAmenity->id], // Keep first, add new
        ];

        // Make API request
        $response = $this->authenticatedApiRequest('PUT', "/room-types/{$roomType->id}", $updateData);

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room type updated successfully',
                'data' => [
                    'id' => $roomType->id,
                    'name' => $updateData['name'],
                    'base_occupancy' => $updateData['base_occupancy'],
                ]
            ]);

        // Refresh the model
        $roomType->refresh();
        
        // Assert database was updated
        $this->assertDatabaseHas('room_types', [
            'id' => $roomType->id,
            'name' => $updateData['name'],
            'base_occupancy' => $updateData['base_occupancy'],
        ]);
        
        // Assert amenities were updated correctly
        $this->assertCount(2, $roomType->amenities);
        $this->assertTrue($roomType->amenities->contains($existingAmenities[0]->id));
        $this->assertTrue($roomType->amenities->contains($newAmenity->id));
        $this->assertFalse($roomType->amenities->contains($existingAmenities[1]->id));
    }

    /** @test */
    public function it_can_delete_a_room_type()
    {
        // Create a test room type
        $roomType = $this->createTestRoomType();

        // Make API request
        $response = $this->authenticatedApiRequest('DELETE', "/room-types/{$roomType->id}");

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room type deleted successfully'
            ]);

        // Assert room type was soft deleted
        $this->assertSoftDeleted('room_types', [
            'id' => $roomType->id
        ]);
    }

    /** @test */
    public function it_prevents_deleting_room_type_in_use()
    {
        // Create a test room type with rooms
        $roomType = $this->createTestRoomType();
        $room = \App\Models\Room::factory()->create([
            'room_type_id' => $roomType->id,
            'hotel_id' => $this->createTestHotel()->id,
        ]);

        // Try to delete the room type
        $response = $this->authenticatedApiRequest('DELETE', "/room-types/{$roomType->id}");

        // Assert deletion was prevented
        $response->assertStatus(422)
            ->assertJson([
                'message' => 'Cannot delete room type that has rooms assigned to it.'
            ]);

        // Assert room type still exists
        $this->assertDatabaseHas('room_types', [
            'id' => $roomType->id,
            'deleted_at' => null,
        ]);
    }

    /** @test */
    public function it_prevents_unauthorized_access()
    {
        // Create a test room type
        $roomType = $this->createTestRoomType();

        // Try to access protected endpoints without authentication
        $this->apiRequest('POST', '/room-types', [])->assertStatus(401);
        $this->apiRequest('PUT', "/room-types/{$roomType->id}", [])->assertStatus(401);
        $this->apiRequest('DELETE', "/room-types/{$roomType->id}")->assertStatus(401);
    }
}
