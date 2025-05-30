<?php

namespace Database\Factories;

use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RoomTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RoomType::class;

    /**
     * Configure the model factory to ensure unique names and slugs.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterMaking(function (RoomType $roomType) {
            // Ensure slug is generated from name if not set
            if (empty($roomType->slug)) {
                $roomType->slug = Str::slug($roomType->name) . '-' . Str::random(6);
            }
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Use a unique name to avoid duplicates
        $name = $this->faker->unique()->randomElement([
            'Standard Room', 'Deluxe Room', 'Suite', 'Executive Suite',
            'Family Room', 'Presidential Suite', 'Penthouse', 'Honeymoon Suite',
            'Ocean View Room', 'Garden View Room', 'Accessible Room'
        ]);
        
        $baseOccupancy = $this->faker->numberBetween(1, 2);
        $maxOccupancy = $baseOccupancy + $this->faker->numberBetween(1, 3);
        $maxExtraBeds = $maxOccupancy - $baseOccupancy;
        
        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(6),
            'description' => $this->faker->paragraph,
            'base_occupancy' => $baseOccupancy,
            'max_occupancy' => $maxOccupancy,
            'max_extra_beds' => $maxExtraBeds,
            'extra_bed_charge' => $this->faker->randomFloat(2, 20, 50),
            'base_price' => $this->faker->randomFloat(2, 80, 500),
            'amenities' => $this->faker->randomElements(
                [
                    'Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 
                    'Safe', 'Hair Dryer', 'Coffee Maker', 'Bathtub', 'Desk', 
                    'Refrigerator', 'Microwave'
                ],
                $this->faker->numberBetween(3, 7)
            ),
        ];
    }
    
    /**
     * Indicate that the room type is an executive suite.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function executiveSuite()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Executive Suite',
                'base_occupancy' => 2,
                'max_occupancy' => 4,
                'max_extra_beds' => 2,
                'extra_bed_charge' => 50.00,
                'amenities' => [
                    'Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 
                    'Safe', 'Hair Dryer', 'Coffee Maker', 'Bathtub', 'Desk', 'Sofa'
                ],
            ];
        });
    }
    
    /**
     * Indicate that the room type is a presidential suite.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function presidentialSuite()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Presidential Suite',
                'base_occupancy' => 4,
                'max_occupancy' => 6,
                'max_extra_beds' => 2,
                'extra_bed_charge' => 75.00,
                'amenities' => [
                    'Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 
                    'Safe', 'Hair Dryer', 'Coffee Maker', 'Bathtub', 'Desk', 'Iron'
                ],
            ];
        });
    }
}
