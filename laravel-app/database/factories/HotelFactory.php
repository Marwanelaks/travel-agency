<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class HotelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Hotel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->company . ' ' . $this->faker->randomElement(['Hotel', 'Resort', 'Inn', 'Suites']);
        $cities = [
            ['city' => 'New York', 'state' => 'NY', 'country' => 'USA'],
            ['city' => 'Los Angeles', 'state' => 'CA', 'country' => 'USA'],
            ['city' => 'London', 'state' => '', 'country' => 'UK'],
            ['city' => 'Paris', 'state' => '', 'country' => 'France'],
            ['city' => 'Tokyo', 'state' => '', 'country' => 'Japan'],
        ];
        $location = $this->faker->randomElement($cities);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(),
            'address' => $this->faker->streetAddress,
            'city' => $location['city'],
            'state' => $location['state'],
            'country' => $location['country'],
            'postal_code' => $this->faker->postcode,
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->companyEmail,
            'website' => 'https://' . $this->faker->domainName,
            'star_rating' => 3, // Default value
            'check_in_time' => $this->faker->time('H:i'),
            'check_out_time' => $this->faker->time('H:i'),
            'amenities' => $this->faker->randomElements([
                'Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center',
                'Restaurant', 'Bar', 'Room Service', '24-Hour Front Desk',
                'Concierge', 'Business Center', 'Laundry Service', 'Airport Shuttle'
            ], $this->faker->numberBetween(3, 8)),
            'images' => [
                'https://source.unsplash.com/random/800x600/?hotel,1',
                'https://source.unsplash.com/random/800x600/?hotel,2',
                'https://source.unsplash.com/random/800x600/?hotel,3',
            ],
            'status' => 'draft', // Default value
            'featured' => $this->faker->boolean(30), // 30% chance of being featured
        ];
    }

    /**
     * Indicate that the hotel is published.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function published()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'published',
            ];
        });
    }

    /**
     * Indicate that the hotel is featured.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function featured()
    {
        return $this->state(function (array $attributes) {
            return [
                'featured' => true,
            ];
        });
    }
}
