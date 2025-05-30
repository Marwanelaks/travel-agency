<?php

namespace Tests\Feature\Api;

use App\Models\RoomType;
use App\Models\RoomAmenity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoomTypeApiTest extends TestCase
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
    public function it_can_list_room_types()
    {
        $roomTypes = RoomType::factory()->count(3)->create();

        $response = $this->getJson('/api/room-types');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'name', 'slug', 'description', 'base_occupancy',
                        'max_occupancy', 'max_extra_beds', 'extra_bed_charge', 'base_price'
                    ]
                ],
                'links',
                'meta'
            ]);
    }

    /** @test */
    public function it_can_show_a_room_type()
    {
        $roomType = RoomType::factory()->create();

        $response = $this->getJson("/api/room-types/{$roomType->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'slug' => $roomType->slug,
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_room_type()
    {
        // Create some amenities first
        $amenities = RoomAmenity::factory()->count(2)->create();
        
        // Prepare room type data with all required fields
        $roomTypeData = [
            'name' => 'Deluxe Suite',
            'description' => 'A luxurious suite with premium amenities',
            'base_occupancy' => 2,
            'max_occupancy' => 4,
            'max_extra_beds' => 1,
            'extra_bed_charge' => 50.00,
            'base_price' => 199.99,
            'amenities' => $amenities->pluck('id')->toArray()
        ];
        
        // Make the API request
        $response = $this->postJson('/api/room-types', $roomTypeData);

        // Assert the response structure and data
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
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
                    'amenities'
                ]
            ])
            ->assertJson([
                'message' => 'Room type created successfully',
                'data' => [
                    'name' => 'Deluxe Suite',
                    'slug' => 'deluxe-suite',
                    'description' => 'A luxurious suite with premium amenities',
                    'base_occupancy' => 2,
                    'max_occupancy' => 4,
                    'max_extra_beds' => 1,
                    'extra_bed_charge' => 50.0,
                    'base_price' => 199.99
                ]
            ]);

        // Assert the room type was created in the database
        $this->assertDatabaseHas('room_types', [
            'name' => 'Deluxe Suite',
            'slug' => 'deluxe-suite',
            'description' => 'A luxurious suite with premium amenities',
            'base_occupancy' => 2,
            'max_occupancy' => 4,
            'max_extra_beds' => 1,
            'extra_bed_charge' => 50.00,
            'base_price' => 199.99
        ]);
        
        // Get the created room type with its relationships
        $roomType = RoomType::with('amenities')->where('slug', 'deluxe-suite')->first();
        
        // Check if amenities were attached
        $this->assertCount(2, $roomType->amenities);
        
        // Verify each amenity is attached in the pivot table
        foreach ($amenities as $amenity) {
            $this->assertDatabaseHas('room_type_amenity', [
                'room_type_id' => $roomType->id,
                'amenity_id' => $amenity->id
            ]);
        }
    }

    /** @test */
    public function it_validates_required_fields_when_creating_room_type()
    {
        $response = $this->postJson('/api/room-types', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name', 'base_occupancy', 'max_occupancy',
                'max_extra_beds', 'extra_bed_charge', 'base_price'
            ]);
    }

    /** @test */
    public function it_validates_max_occupancy_greater_than_base()
    {
        $response = $this->postJson('/api/room-types', [
            'name' => 'Test Room',
            'base_occupancy' => 4,
            'max_occupancy' => 2, // Invalid: max_occupancy should be >= base_occupancy
            'max_extra_beds' => 0,
            'extra_bed_charge' => 0,
            'base_price' => 100
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['max_occupancy']);
    }

    /** @test */
    public function it_can_update_a_room_type()
    {
        // Create some amenities for testing
        $existingAmenities = RoomAmenity::factory()->count(2)->create();
        $newAmenity = RoomAmenity::factory()->create();
        
        // Create a room type with all required fields
        $roomType = RoomType::factory()->create([
            'name' => 'Original Room Type',
            'slug' => 'original-room-type',
            'description' => 'Original description',
            'base_occupancy' => 2,
            'max_occupancy' => 4,
            'max_extra_beds' => 1,
            'extra_bed_charge' => 50.00,
            'base_price' => 100.00
        ]);
        
        // Attach amenities to the room type
        $roomType->amenities()->attach($existingAmenities->pluck('id')->toArray());
        
        // Prepare update data
        $updateData = [
            'name' => 'Updated Room Type',
            'slug' => 'updated-room-type',
            'description' => 'Updated description',
            'base_occupancy' => 3,
            'max_occupancy' => 5,
            'max_extra_beds' => 2,
            'extra_bed_charge' => 75.00,
            'base_price' => 150.00,
            'amenities' => [$existingAmenities[0]->id, $newAmenity->id] // Keep first amenity, add a new one
        ];

        // Make the API request
        $response = $this->putJson("/api/room-types/{$roomType->id}", $updateData);

        // Assert the response status and message
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Room type updated successfully'
            ]);
        
        // Refresh the model to get updated data
        $roomType->refresh();
        
        // Assert the room type was updated in the database
        $this->assertDatabaseHas('room_types', [
            'id' => $roomType->id,
            'name' => 'Updated Room Type',
            'slug' => 'updated-room-type',
            'description' => 'Updated description',
            'base_occupancy' => 3,
            'max_occupancy' => 5,
            'max_extra_beds' => 2,
            'extra_bed_charge' => 75.00,
            'base_price' => 150.00
        ]);
        
        // Verify the pivot table was updated
        $this->assertDatabaseHas('room_type_amenity', [
            'room_type_id' => $roomType->id,
            'amenity_id' => $existingAmenities[0]->id
        ]);
        $this->assertDatabaseHas('room_type_amenity', [
            'room_type_id' => $roomType->id,
            'amenity_id' => $newAmenity->id
        ]);
        $this->assertDatabaseMissing('room_type_amenity', [
            'room_type_id' => $roomType->id,
            'amenity_id' => $existingAmenities[1]->id
        ]);
        
        // Verify the relationships were updated
        $this->assertCount(2, $roomType->amenities);
        $this->assertTrue($roomType->amenities->contains($existingAmenities[0]->id));
        $this->assertTrue($roomType->amenities->contains($newAmenity->id));
        $this->assertFalse($roomType->amenities->contains($existingAmenities[1]->id));
        
        // Verify the pivot table was updated
        $this->assertDatabaseHas('room_type_amenity', [
            'room_type_id' => $roomType->id,
            'amenity_id' => $existingAmenities[0]->id
        ]);
        $this->assertDatabaseHas('room_type_amenity', [
            'room_type_id' => $roomType->id,
            'amenity_id' => $newAmenity->id
        ]);
        $this->assertDatabaseMissing('room_type_amenity', [
            'room_type_id' => $roomType->id,
            'amenity_id' => $existingAmenities[1]->id
        ]);
    }

    /** @test */
    public function it_can_delete_a_room_type()
    {
        // Create a room type
        $roomType = RoomType::factory()->create();
        
        // Verify the room type exists in the database
        $this->assertDatabaseHas('room_types', ['id' => $roomType->id]);
        
        // Send delete request
        $response = $this->deleteJson("/api/room-types/{$roomType->id}");
        
        // Assert the response is 204 No Content
        $response->assertStatus(204);
        
        // Check if the room type is soft deleted
        $this->assertSoftDeleted('room_types', ['id' => $roomType->id]);
        
        // Verify the room type is not in the regular query results
        $this->assertNull(RoomType::find($roomType->id));
        
        // Verify the room type is in the withTrashed results
        $this->assertNotNull(RoomType::withTrashed()->find($roomType->id));
    }

    /** @test */
    public function it_cannot_delete_room_type_in_use()
    {
        $roomType = RoomType::factory()->hasRooms(1)->create();

        $response = $this->deleteJson("/api/room-types/{$roomType->id}");

        $response->assertStatus(409)
            ->assertJson([
                'message' => 'Cannot delete room type that is in use by rooms'
            ]);
            
        $this->assertDatabaseHas('room_types', ['id' => $roomType->id]);
    }
}
