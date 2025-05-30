<?php

namespace Tests\Unit;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HotelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_hotel()
    {
        $hotel = Hotel::factory()->create([
            'name' => 'Test Hotel',
            'star_rating' => 4,
            'status' => 'draft', // Explicitly set status to 'draft'
        ]);

        $this->assertDatabaseHas('hotels', [
            'name' => 'Test Hotel',
            'star_rating' => 4,
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function it_can_have_rooms()
    {
        $hotel = Hotel::factory()
            ->has(Room::factory()->count(3))
            ->create();

        $this->assertCount(3, $hotel->rooms);
        $this->assertInstanceOf(Room::class, $hotel->rooms->first());
    }

    /** @test */
    public function it_can_get_full_address()
    {
        $hotel = Hotel::factory()->create([
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'TS',
            'country' => 'Testland',
            'postal_code' => '12345',
        ]);

        $this->assertEquals(
            '123 Test St, Test City, TS, Testland, 12345',
            $hotel->full_address
        );
    }

    /** @test */
    public function it_can_get_main_image()
    {
        $hotel = Hotel::factory()->create([
            'images' => ['image1.jpg', 'image2.jpg']
        ]);

        $this->assertEquals('image1.jpg', $hotel->main_image);
    }

    /** @test */
    public function it_returns_null_main_image_when_no_images()
    {
        $hotel = Hotel::factory()->create(['images' => null]);
        $this->assertNull($hotel->main_image);
    }

    /** @test */
    public function it_can_scope_featured_hotels()
    {
        Hotel::factory()->count(3)->create(['featured' => false]);
        $featuredHotel = Hotel::factory()->create(['featured' => true]);

        $featuredHotels = Hotel::featured()->get();

        $this->assertCount(1, $featuredHotels);
        $this->assertEquals($featuredHotel->id, $featuredHotels->first()->id);
    }

    /** @test */
    public function it_can_scope_active_hotels()
    {
        Hotel::factory()->create(['status' => 'draft']);
        $publishedHotel = Hotel::factory()->create(['status' => 'published']);

        $activeHotels = Hotel::active()->get();

        $this->assertCount(1, $activeHotels);
        $this->assertEquals($publishedHotel->id, $activeHotels->first()->id);
    }

    /** @test */
    public function it_can_get_available_rooms()
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
        Room::factory()->create([
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomType->id,
            'available_quantity' => 0,
            'status' => 'booked'
        ]);

        // Refresh the hotel to ensure we're getting fresh data
        $hotel->refresh();
        
        $availableRooms = $hotel->availableRooms;
        $this->assertCount(3, $availableRooms);
    }
}
