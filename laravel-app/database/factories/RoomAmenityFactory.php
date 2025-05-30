<?php

namespace Database\Factories;

use App\Models\RoomAmenity;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomAmenityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RoomAmenity::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $amenities = [
            'Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Safe', 'Hair Dryer',
            'Coffee Maker', 'Iron', 'Desk', 'Refrigerator', 'Microwave', 'Kitchen',
            'Balcony', 'Ocean View', 'Mountain View', 'City View', 'Pool View',
            'Bathtub', 'Shower', 'Jacuzzi', 'Private Bathroom', 'Toiletries',
            'Telephone', 'Wake-up Service', 'Alarm Clock', 'Soundproofing',
            'Heating', 'Fan', 'Fireplace', 'Sofa', 'Seating Area', 'Dining Area',
            'Wardrobe/Closet', 'Clothes Rack', 'Slippers', 'Towels', 'Linens',
            'Electric Kettle', 'Dishwasher', 'Stovetop', 'Oven', 'Toaster',
            'Dining Table', 'High Chair', 'Baby Safety Gates', 'Baby Cribs',
            'Interconnecting Rooms', 'Elevator', 'Upper Floors Accessible by Stairs Only',
            'Smoking Allowed', 'Non-Smoking', 'Pet Friendly'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($amenities),
            'description' => $this->faker->sentence(),
            'icon' => $this->faker->randomElement([
                'wifi', 'tv', 'snowflake', 'wine-bottle', 'lock', 'wind',
                'coffee', 'tshirt', 'desktop', 'couch', 'utensils', 'shower',
                'umbrella-beach', 'mountain', 'city', 'swimming-pool', 'bath',
                'phone', 'bell', 'clock', 'volume-up', 'fire', 'couch', 'chair',
                'door-closed', 'fan', 'baby-carriage', 'smoking', 'smoking-ban', 'paw'
            ]),
        ];
    }
}
