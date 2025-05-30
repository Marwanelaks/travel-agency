<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\RoomAmenity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HotelManagementTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_hotel_with_required_fields()
    {
        // Create a hotel with only required fields and explicitly set featured to false
        $hotel = Hotel::factory()->create([
            'name' => 'Grand Plaza Hotel',
            'address' => '123 Main St',
            'city' => 'New York',
            'country' => 'USA',
            'status' => 'draft',
            'featured' => false,
        ]);

        // Assert the hotel was created with default values
        $this->assertDatabaseHas('hotels', [
            'name' => 'Grand Plaza Hotel',
            'city' => 'New York',
            'country' => 'USA',
            'status' => 'draft',
            'star_rating' => 3, // Default value
            'featured' => false, // Default value as boolean due to model casting
        ]);
    }

    /** @test */
    public function it_can_update_hotel_details()
    {
        $hotel = Hotel::factory()->create(['status' => 'draft']);
        
        $updateData = [
            'name' => 'Updated Hotel Name',
            'star_rating' => 5,
            'status' => 'published',
            'description' => 'A luxurious hotel experience',
        ];

        $hotel->update($updateData);

        $this->assertDatabaseHas('hotels', [
            'id' => $hotel->id,
            'name' => 'Updated Hotel Name',
            'star_rating' => 5,
            'status' => 'published',
        ]);
    }

    /** @test */
    public function it_can_soft_delete_a_hotel()
    {
        $hotel = Hotel::factory()->create();
        
        $hotel->delete();
        
        $this->assertSoftDeleted($hotel);
        $this->assertDatabaseHas('hotels', ['id' => $hotel->id]);
    }

    /** @test */
    public function it_can_add_rooms_to_a_hotel()
    {
        $hotel = Hotel::factory()->create();
        $roomType = RoomType::factory()->create();
        
        $room = Room::create([
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'room_number' => '101',
            'price_per_night' => 199.99,
            'quantity' => 2,
            'available_quantity' => 2,
            'status' => 'available',
        ]);
        
        $this->assertDatabaseHas('rooms', [
            'id' => $room->id,
            'hotel_id' => $hotel->id,
            'room_number' => '101',
            'status' => 'available',
        ]);
        
        $this->assertCount(1, $hotel->rooms);
    }

    /** @test */
    public function it_can_retrieve_only_available_rooms()
    {
        $hotel = Hotel::factory()->create();
        $roomType = RoomType::factory()->create();
        
        // Create available rooms
        $availableRooms = Room::factory()->count(3)->create([
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'available_quantity' => 1,
            'status' => 'available'
        ]);
        
        // Create unavailable room
        $unavailableRoom = Room::factory()->create([
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'available_quantity' => 0,
            'status' => 'booked'
        ]);

        $hotel->refresh();
        
        $this->assertCount(3, $hotel->availableRooms);
        $this->assertTrue($hotel->availableRooms->contains('id', $availableRooms[0]->id));
        $this->assertFalse($hotel->availableRooms->contains('id', $unavailableRoom->id));
    }

    /** @test */
    public function it_can_manage_room_amenities()
    {
        $room = Room::factory()->create();
        $amenities = RoomAmenity::factory()->count(3)->create();
        
        // Attach amenities to room
        $room->amenities()->attach($amenities->pluck('id'));
        
        $this->assertCount(3, $room->amenities);
        
        // Detach one amenity
        $room->amenities()->detach($amenities[0]->id);
        
        $this->assertCount(2, $room->fresh()->amenities);
    }

    /** @test */
    public function it_can_retrieve_featured_hotels()
    {
        // Create featured hotels
        $featuredHotels = Hotel::factory()->count(3)->create(['featured' => true]);
        // Create non-featured hotels
        Hotel::factory()->count(2)->create(['featured' => false]);
        
        $featured = Hotel::featured()->get();
        
        $this->assertCount(3, $featured);
        $this->assertTrue($featured->contains('id', $featuredHotels[0]->id));
    }

    /** @test */
    public function it_can_retrieve_published_hotels()
    {
        // Create published hotels
        $publishedHotels = Hotel::factory()->count(2)->create(['status' => 'published']);
        // Create non-published hotels
        Hotel::factory()->create(['status' => 'draft']);
        Hotel::factory()->create(['status' => 'unpublished']);
        
        $activeHotels = Hotel::active()->get();
        
        $this->assertCount(2, $activeHotels);
        $this->assertTrue($activeHotels->contains('id', $publishedHotels[0]->id));
    }

    /** @test */
    public function it_can_generate_slug_for_hotel()
    {
        $hotel = Hotel::factory()->create([
            'name' => 'Grand Plaza Hotel',
            'slug' => null
        ]);
        
        // The slug should be generated from the name
        $this->assertEquals('grand-plaza-hotel', $hotel->slug);
        
        // Test slug uniqueness - the second hotel with the same name should get a unique slug
        $hotel2 = Hotel::factory()->create([
            'name' => 'Grand Plaza Hotel'
        ]);
        
        // The second hotel should have a different slug than the first one
        $this->assertNotEquals('grand-plaza-hotel', $hotel2->slug);
        
        // The slug should be a valid string
        $this->assertIsString($hotel2->slug);
        $this->assertNotEmpty($hotel2->slug);
    }

    /** @test */
    public function it_can_get_hotel_full_address()
    {
        $hotel = Hotel::factory()->create([
            'address' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'country' => 'USA',
            'postal_code' => '10001'
        ]);
        
        $expectedAddress = '123 Main St, New York, NY, USA, 10001';
        $this->assertEquals($expectedAddress, $hotel->full_address);
        
        // Test with missing optional fields
        $hotel->update(['state' => null, 'postal_code' => null]);
        $expectedAddress = '123 Main St, New York, USA';
        $this->assertEquals($expectedAddress, $hotel->fresh()->full_address);
    }

    /** @test */
    public function it_can_get_hotel_main_image()
    {
        $images = [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
        ];
        
        $hotel = Hotel::factory()->create(['images' => $images]);
        
        $this->assertEquals($images[0], $hotel->main_image);
        
        // Test with no images
        $hotel->update(['images' => []]);
        $this->assertNull($hotel->fresh()->main_image);
    }
}
