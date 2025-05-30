<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $roomTypes = [
            ['name' => 'Standard Room', 'base_price' => 100],
            ['name' => 'Deluxe Room', 'base_price' => 150],
            ['name' => 'Executive Suite', 'base_price' => 250],
            ['name' => 'Presidential Suite', 'base_price' => 500],
        ];

        $roomType = $this->faker->randomElement($roomTypes);
        $roomTypeModel = RoomType::firstOrCreate(
            ['name' => $roomType['name']],
            [
                'slug' => \Illuminate\Support\Str::slug($roomType['name']),
                'description' => 'Comfortable ' . $roomType['name'],
                'base_occupancy' => 2,
                'max_occupancy' => 4,
                'max_extra_beds' => 2,
                'extra_bed_charge' => 30.00,
            ]
        );

        $hotel = Hotel::inRandomOrder()->first() ?? Hotel::factory()->create();
        
        $roomNumber = $this->faker->unique()->numberBetween(100, 599);
        $floor = (int)($roomNumber / 100);
        
        $roomSizes = [
            'Standard Room' => ['sqm' => 25, 'sqft' => 269],
            'Deluxe Room' => ['sqm' => 35, 'sqft' => 377],
            'Executive Suite' => ['sqm' => 50, 'sqft' => 538],
            'Presidential Suite' => ['sqm' => 80, 'sqft' => 861],
        ];

        $size = $roomSizes[$roomType['name']] ?? ['sqm' => 25, 'sqft' => 269];
        
        return [
            'hotel_id' => $hotel->id,
            'room_type_id' => $roomTypeModel->id,
            'room_number' => $roomNumber,
            'floor' => $floor,
            'price_per_night' => $roomType['base_price'] * (1 + ($hotel->star_rating / 10)),
            'quantity' => 1,
            'available_quantity' => $this->faker->numberBetween(0, 1),
            'size_sqm' => $size['sqm'],
            'size_sqft' => $size['sqft'],
            'images' => [
                'https://source.unsplash.com/random/800x600/?hotel-room,1',
                'https://source.unsplash.com/random/800x600/?hotel-room,2',
            ],
            'status' => $this->faker->randomElement(['available', 'booked', 'maintenance']),
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }

    /**
     * Indicate that the room is available.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function available()
    {
        return $this->state(function (array $attributes) {
            return [
                'available_quantity' => 1,
                'status' => 'available',
            ];
        });
    }

    /**
     * Indicate that the room is booked.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function booked()
    {
        return $this->state(function (array $attributes) {
            return [
                'available_quantity' => 0,
                'status' => 'booked',
            ];
        });
    }

    /**
     * Indicate that the room is under maintenance.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function maintenance()
    {
        return $this->state(function (array $attributes) {
            return [
                'available_quantity' => 0,
                'status' => 'maintenance',
            ];
        });
    }
}
