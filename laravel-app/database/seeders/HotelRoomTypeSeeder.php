<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\RoomType;
use App\Models\RoomAmenity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HotelRoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create room amenities
        $amenities = [
            ['name' => 'Free WiFi', 'icon' => 'wifi'],
            ['name' => 'Air Conditioning', 'icon' => 'snowflake'],
            ['name' => 'TV', 'icon' => 'tv'],
            ['name' => 'Mini Bar', 'icon' => 'wine-bottle'],
            ['name' => 'Safe', 'icon' => 'lock'],
            ['name' => 'Hair Dryer', 'icon' => 'wind'],
            ['name' => 'Coffee Maker', 'icon' => 'coffee'],
            ['name' => 'Iron', 'icon' => 'iron'],
            ['name' => 'Desk', 'icon' => 'desk'],
            ['name' => 'Bathtub', 'icon' => 'bath'],
        ];

        foreach ($amenities as $amenity) {
            RoomAmenity::firstOrCreate(
                ['name' => $amenity['name']],
                ['icon' => $amenity['icon']]
            );
        }

        // Create room types
        $roomTypes = [
            [
                'name' => 'Standard Room',
                'base_occupancy' => 2,
                'max_occupancy' => 3,
                'max_extra_beds' => 1,
                'extra_bed_charge' => 25.00,
                'amenities' => ['Free WiFi', 'Air Conditioning', 'TV', 'Hair Dryer'],
            ],
            [
                'name' => 'Deluxe Room',
                'base_occupancy' => 2,
                'max_occupancy' => 4,
                'max_extra_beds' => 2,
                'extra_bed_charge' => 30.00,
                'amenities' => ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Safe', 'Hair Dryer', 'Coffee Maker'],
            ],
            [
                'name' => 'Suite',
                'base_occupancy' => 2,
                'max_occupancy' => 5,
                'max_extra_beds' => 3,
                'extra_bed_charge' => 40.00,
                'amenities' => ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Safe', 'Hair Dryer', 'Coffee Maker', 'Bathtub'],
            ],
            [
                'name' => 'Executive Suite',
                'base_occupancy' => 2,
                'max_occupancy' => 4,
                'max_extra_beds' => 2,
                'extra_bed_charge' => 50.00,
                'amenities' => ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Safe', 'Hair Dryer', 'Coffee Maker', 'Bathtub', 'Desk'],
            ],
            [
                'name' => 'Presidential Suite',
                'base_occupancy' => 4,
                'max_occupancy' => 6,
                'max_extra_beds' => 2,
                'extra_bed_charge' => 75.00,
                'amenities' => ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Safe', 'Hair Dryer', 'Coffee Maker', 'Bathtub', 'Desk', 'Iron'],
            ],
        ];

        foreach ($roomTypes as $roomType) {
            $amenities = RoomAmenity::whereIn('name', $roomType['amenities'])->pluck('id')->toArray();
            unset($roomType['amenities']);
            
            $rt = RoomType::firstOrCreate(
                ['slug' => Str::slug($roomType['name'])],
                array_merge($roomType, [
                    'description' => 'Comfortable ' . $roomType['name'] . ' with all necessary amenities.'
                ])
            );
        }

        // Create sample hotels
        $hotels = [
            [
                'name' => 'Grand Plaza Hotel',
                'star_rating' => 5,
                'address' => '123 Luxury Avenue',
                'city' => 'New York',
                'country' => 'USA',
                'postal_code' => '10001',
                'phone' => '+1 212-555-0100',
                'email' => 'info@grandplaza.com',
                'website' => 'https://grandplaza.com',
                'check_in_time' => '15:00:00',
                'check_out_time' => '12:00:00',
                'amenities' => ['Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Business Center'],
                'images' => ['https://example.com/hotels/grand-plaza/1.jpg', 'https://example.com/hotels/grand-plaza/2.jpg'],
                'status' => 'published',
                'featured' => true,
            ],
            [
                'name' => 'Sunset Resort',
                'star_rating' => 4,
                'address' => '456 Beach Boulevard',
                'city' => 'Miami',
                'country' => 'USA',
                'postal_code' => '33139',
                'phone' => '+1 305-555-0100',
                'email' => 'info@sunsetresort.com',
                'website' => 'https://sunsetresort.com',
                'check_in_time' => '16:00:00',
                'check_out_time' => '11:00:00',
                'amenities' => ['Swimming Pool', 'Beach Access', 'Spa', 'Restaurant', 'Bar'],
                'images' => ['https://example.com/hotels/sunset-resort/1.jpg', 'https://example.com/hotels/sunset-resort/2.jpg'],
                'status' => 'published',
                'featured' => true,
            ],
            [
                'name' => 'Mountain View Lodge',
                'star_rating' => 3,
                'address' => '789 Alpine Road',
                'city' => 'Denver',
                'country' => 'USA',
                'postal_code' => '80202',
                'phone' => '+1 303-555-0100',
                'email' => 'info@mountainview.com',
                'website' => 'https://mountainviewlodge.com',
                'check_in_time' => '15:00:00',
                'check_out_time' => '12:00:00',
                'amenities' => ['Ski Storage', 'Restaurant', 'Bar', 'Free Parking', 'Ski Shuttle'],
                'images' => ['https://example.com/hotels/mountain-view/1.jpg', 'https://example.com/hotels/mountain-view/2.jpg'],
                'status' => 'published',
                'featured' => false,
            ],
        ];

        foreach ($hotels as $hotel) {
            $amenities = $hotel['amenities'];
            unset($hotel['amenities']);
            
            $h = Hotel::firstOrCreate(
                ['slug' => Str::slug($hotel['name'])],
                array_merge($hotel, [
                    'short_description' => 'Experience luxury at ' . $hotel['name'],
                    'description' => $hotel['name'] . ' offers world-class amenities and exceptional service to make your stay memorable.'
                ])
            );

            // Create rooms for each hotel
            $this->createRoomsForHotel($h);
        }
    }

    /**
     * Create sample rooms for a hotel
     */
    private function createRoomsForHotel(Hotel $hotel): void
    {
        $roomTypes = RoomType::all();
        $floor = 1;
        $roomNumber = 100;

        foreach ($roomTypes as $roomType) {
            // Create 5-10 rooms of each type
            $roomCount = rand(5, 10);
            
            for ($i = 1; $i <= $roomCount; $i++) {
                // Use firstOrCreate to prevent duplicate entries
                $hotel->rooms()->firstOrCreate(
                    [
                        // Unique constraint columns
                        'hotel_id' => $hotel->id,
                        'room_number' => $roomNumber + $i,
                    ],
                    [
                        'room_type_id' => $roomType->id,
                        'floor' => $floor,
                        'price_per_night' => $this->getRoomTypeBasePrice($roomType->name) * (1 + ($hotel->star_rating / 10)),
                        'quantity' => 1,
                        'available_quantity' => 1,
                        'size_sqm' => $this->getRoomTypeSize($roomType->name),
                        'size_sqft' => $this->getRoomTypeSize($roomType->name, 'sqft'),
                        'images' => $this->getRoomImages($roomType->name),
                        'status' => 'available',
                    ]
                );

                // Increment floor every 10 rooms
                if ($i % 10 === 0) {
                    $floor++;
                }
            }

            $roomNumber += 100; // Next room type starts at next hundred
        }
    }

    /**
     * Get base price based on room type
     */
    private function getRoomTypeBasePrice(string $roomType): float
    {
        return match($roomType) {
            'Standard Room' => 100.00,
            'Deluxe Room' => 150.00,
            'Suite' => 250.00,
            'Executive Suite' => 400.00,
            'Presidential Suite' => 700.00,
            default => 100.00,
        };
    }

    /**
     * Get room size based on room type
     */
    private function getRoomTypeSize(string $roomType, string $unit = 'sqm'): int
    {
        $sizes = [
            'Standard Room' => ['sqm' => 25, 'sqft' => 270],
            'Deluxe Room' => ['sqm' => 35, 'sqft' => 377],
            'Suite' => ['sqm' => 50, 'sqft' => 538],
            'Executive Suite' => ['sqm' => 70, 'sqft' => 753],
            'Presidential Suite' => ['sqm' => 100, 'sqft' => 1076],
        ];

        return $sizes[$roomType][$unit] ?? ($unit === 'sqm' ? 25 : 270);
    }

    /**
     * Get sample room images based on room type
     */
    private function getRoomImages(string $roomType): array
    {
        $type = strtolower(str_replace(' ', '-', $roomType));
        return [
            "https://example.com/rooms/{$type}/1.jpg",
            "https://example.com/rooms/{$type}/2.jpg",
            "https://example.com/rooms/{$type}/3.jpg",
        ];
    }
}
