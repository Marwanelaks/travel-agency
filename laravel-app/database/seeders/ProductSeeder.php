<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Luxury Hotels
            [
                'name' => 'Emerald Bay Resort & Spa',
                'type' => 'hotel',
                'description' => '5-star luxury beachfront resort with private beach, infinity pools, and world-class spa facilities. Enjoy breathtaking ocean views and personalized butler service.',
                'price' => 459.99,
                'is_active' => true,
                'location' => 'Maldives',
                'image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.8,
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'capacity' => 2,
                'hotel_details' => json_encode([
                    'rooms' => 2,
                    'bathrooms' => 2,
                    'beds' => 1,
                    'amenities' => ['pool', 'spa', 'restaurant', 'wifi', 'beach_access', 'fitness_center'],
                    'stars' => 5,
                    'check_in' => '14:00',
                    'check_out' => '12:00',
                ]),
            ],
            [
                'name' => 'Mountain Peak Lodge',
                'type' => 'hotel',
                'description' => 'Luxury alpine lodge with stunning mountain views, ski-in/ski-out access, and a world-class spa. Perfect for winter sports enthusiasts and nature lovers.',
                'price' => 389.99,
                'is_active' => true,
                'location' => 'Swiss Alps, Switzerland',
                'image' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.9,
                'start_date' => '2024-12-01',
                'end_date' => '2025-03-31',
                'capacity' => 2,
                'hotel_details' => json_encode([
                    'rooms' => 1,
                    'bathrooms' => 1,
                    'beds' => 1,
                    'amenities' => ['spa', 'restaurant', 'wifi', 'ski_in_out', 'hot_tub', 'fitness_center'],
                    'stars' => 5,
                    'check_in' => '15:00',
                    'check_out' => '11:00',
                ]),
            ],
            
            // Flights
            [
                'name' => 'Business Class to Paris',
                'type' => 'flight',
                'description' => 'Round-trip business class flight with lie-flat seats, premium dining, and lounge access. Experience luxury at 40,000 feet with our award-winning service.',
                'price' => 2899.99,
                'is_active' => true,
                'location' => 'Dubai to Paris',
                'image' => 'https://images.unsplash.com/photo-1436491865333-4bdcb1bd645d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.7,
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'capacity' => 1,
                'flight_details' => json_encode([
                    'airline' => 'Emirates',
                    'flight_number' => 'EK 071',
                    'duration' => '7h 15m',
                    'baggage_allowance' => '2 x 32kg',
                    'cabin_baggage' => '1 x 7kg',
                    'departure' => 'DXB (Dubai International)',
                    'arrival' => 'CDG (Charles de Gaulle)',
                    'departure_time' => '08:15',
                    'arrival_time' => '13:30',
                    'aircraft' => 'Boeing 777-300ER',
                    'cabin_class' => 'Business',
                    'meal_service' => true,
                    'entertainment' => true,
                    'wifi' => true,
                ]),
            ],
            [
                'name' => 'Premium Economy to Tokyo',
                'type' => 'flight',
                'description' => 'Comfortable premium economy class with extra legroom, enhanced dining, and priority boarding. Enjoy a more relaxed journey to the Land of the Rising Sun.',
                'price' => 1599.99,
                'is_active' => true,
                'location' => 'London to Tokyo',
                'image' => 'https://images.unsplash.com/photo-1436492270482-9e1ea260ff25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.5,
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'capacity' => 1,
                'flight_details' => json_encode([
                    'airline' => 'Japan Airlines',
                    'flight_number' => 'JL 42',
                    'duration' => '11h 45m',
                    'baggage_allowance' => '2 x 23kg',
                    'cabin_baggage' => '1 x 10kg',
                    'departure' => 'LHR (Heathrow)',
                    'arrival' => 'HND (Haneda)',
                    'departure_time' => '10:30',
                    'arrival_time' => '09:15 (+1 day)',
                    'aircraft' => 'Boeing 787-9',
                    'cabin_class' => 'Premium Economy',
                    'meal_service' => true,
                    'entertainment' => true,
                    'wifi' => true,
                ]),
            ],

            // Events
            [
                'name' => 'Summer Music Festival',
                'type' => 'entertainment',
                'description' => '3-day international music festival featuring top artists from around the world. Experience unforgettable performances across multiple stages with gourmet food trucks and art installations.',
                'price' => 299.99,
                'is_active' => true,
                'location' => 'Barcelona, Spain',
                'image' => 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'start_date' => '2024-07-15',
                'end_date' => '2024-07-17',
                'capacity' => 50000,
                'rating' => 4.8,
                'entertainment_details' => json_encode([
                    'genre' => ['Pop', 'Rock', 'Electronic', 'Hip-Hop'],
                    'age_restriction' => '18+',
                    'duration' => '3 days',
                    'venue' => 'Parc del Fòrum',
                    'artists' => ['Coldplay', 'The Weeknd', 'Dua Lipa', 'Kendrick Lamar'],
                    'features' => ['Food Trucks', 'Bars', 'Art Installations', 'VIP Areas'],
                ]),
            ],

            // Sports
            [
                'name' => 'Premier League Match',
                'type' => 'sport',
                'description' => 'Experience the thrill of live Premier League football with top teams battling it out on the pitch. Includes premium seating and match program.',
                'price' => 199.99,
                'is_active' => true,
                'location' => 'London, UK',
                'image' => 'https://images.unsplash.com/photo-1579952363872-0d3e75b31811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'start_date' => '2024-08-20',
                'end_date' => '2024-08-20',
                'capacity' => 60000,
                'rating' => 4.9,
                'sport_details' => json_encode([
                    'sport' => 'Football',
                    'teams' => ['Arsenal', 'Chelsea'],
                    'league' => 'Premier League',
                    'venue' => 'Emirates Stadium',
                    'seating' => 'Premium West Stand',
                    'inclusions' => ['Match Ticket', 'Program', 'Food & Beverage Voucher'],
                ]),
            ],

            // Vacation Packages
            [
                'name' => 'Romantic Venice Getaway',
                'type' => 'package',
                'description' => '4-day romantic package including luxury hotel, gondola ride, and fine dining. Experience the magic of Venice with your loved one.',
                'price' => 1899.99,
                'is_active' => true,
                'location' => 'Venice, Italy',
                'image' => 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'capacity' => 2,
                'rating' => 4.9,
                'package_details' => json_encode([
                    'duration' => '4 days / 3 nights',
                    'included' => [
                        'Luxury hotel accommodation',
                        'Daily breakfast',
                        'Sunset gondola ride',
                        '3-course dinner at Michelin-starred restaurant',
                        'Private walking tour',
                        'Round-trip airport transfers'
                    ],
                    'hotel' => 'Bauer Palazzo',
                    'room_type' => 'Deluxe Canal View',
                    'meals' => 'Breakfast included',
                ]),
            ],

            // Car Rentals
            [
                'name' => 'Luxury Convertible',
                'type' => 'car',
                'description' => 'Drive in style with our premium convertible. Perfect for coastal roads and city exploration. Includes unlimited mileage and full insurance coverage.',
                'price' => 299.99,
                'is_active' => true,
                'location' => 'Los Angeles, USA',
                'image' => 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'start_date' => '2024-06-01',
                'end_date' => '2024-12-31',
                'capacity' => 4,
                'rating' => 4.7,
                'car_details' => json_encode([
                    'make' => 'Porsche',
                    'model' => '911 Carrera Cabriolet',
                    'year' => 2023,
                    'type' => 'Convertible',
                    'seats' => 4,
                    'transmission' => 'Automatic',
                    'features' => ['Convertible', 'Navigation', 'Bluetooth', 'Premium Sound'],
                    'unlimited_mileage' => true,
                    'insurance' => 'Full coverage included',
                ]),
            ],

            // Insurance
            [
                'name' => 'Comprehensive Travel Insurance',
                'type' => 'insurance',
                'description' => 'Complete travel protection including medical coverage, trip cancellation, and lost luggage. Travel with peace of mind knowing you are fully covered.',
                'price' => 89.99,
                'is_active' => true,
                'location' => 'Worldwide',
                'image' => 'https://images.unsplash.com/photo-1531545511498-4ca9f9d5db5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'start_date' => '2024-06-01',
                'end_date' => '2025-12-31',
                'capacity' => 10,
                'rating' => 4.6,
                'insurance_details' => json_encode([
                    'coverage_type' => 'Comprehensive',
                    'duration' => '30 days',
                    'medical_coverage' => '$500,000',
                    'trip_cancellation' => 'Up to $10,000',
                    'baggage_loss' => 'Up to $2,500',
                    'trip_interruption' => 'Up to $15,000',
                    'emergency_evacuation' => true,
                    'pre_existing_conditions' => 'Covered with conditions',
                ]),
            ],

            // Cruise
            [
                'name' => 'Caribbean Cruise',
                'type' => 'cruise',
                'description' => '7-night luxury Caribbean cruise visiting exotic islands with all-inclusive dining and entertainment. Experience paradise on the high seas with world-class amenities.',
                'price' => 1299.99,
                'is_active' => true,
                'location' => 'Caribbean',
                'image' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'start_date' => '2024-09-15',
                'end_date' => '2024-12-31',
                'capacity' => 2,
                'rating' => 4.8,
                'cruise_details' => json_encode([
                    'duration' => '7 nights',
                    'ship' => 'Symphony of the Seas',
                    'departure_port' => 'Miami, Florida',
                    'ports' => ['Nassau, Bahamas', 'Charlotte Amalie, St. Thomas', 'Philipsburg, St. Maarten'],
                    'cabin_type' => 'Balcony Stateroom',
                    'dining' => 'All-inclusive',
                    'entertainment' => ['Broadway Shows', 'Casino', 'Nightclubs', 'Pools'],
                    'amenities' => ['Spa', 'Fitness Center', 'Kids Club', 'Multiple Restaurants'],
                ]),
            ],
            [
                'name' => 'Hamilton on Broadway',
                'type' => 'entertainment',
                'description' => 'Premium orchestra seats for the Tony Award-winning musical Hamilton. Experience the revolutionary story of America\'s founding fathers like never before.',
                'price' => 399.99,
                'is_active' => true,
                'location' => 'Richard Rodgers Theatre, New York',
                'image' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.9,
                'entertainment_details' => [
                    'show' => 'Hamilton',
                    'date' => '2025-07-15',
                    'time' => '19:30',
                    'duration' => '2h 45min (including intermission)',
                    'theater' => 'Richard Rodgers Theatre',
                    'address' => '226 W 46th St, New York, NY 10036',
                    'section' => 'Orchestra',
                    'row' => 'D',
                    'seat' => '12-14',
                    'age_restriction' => 'Recommended for ages 10+',
                    'includes' => ['Premium seating', 'Digital program', 'Exclusive merchandise discount'],
                    'accessibility' => ['Wheelchair accessible', 'Assistive listening devices available'],
                ],
    ],
            [
                'name' => 'Romantic Rome Weekend Escape',
                'type' => 'package',
                'description' => '3-day all-inclusive romantic getaway for two in the heart of Rome. Includes luxury accommodation, private tours, and fine dining experiences.',
                'price' => 2499.99,
                'is_active' => true,
                'location' => 'Rome, Italy',
                'image' => 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.8,
                'package_details' => [
                    'duration' => '3 days / 2 nights',
                    'included' => [
                        'Luxury hotel accommodation',
                        'Daily breakfast in bed',
                        'Private transfer from/to airport',
                        'Exclusive Colosseum tour with skip-the-line access',
                        'Sunset dinner at Aroma Restaurant with views of the Colosseum',
                        'Vatican Museums & Sistine Chapel private tour',
                        'Romantic gondola ride on the Tiber River',
                        'Personalized shopping experience with a stylist',
                        '24/7 concierge service'
                    ],
                    'hotel' => 'Hotel de la Ville - Rocco Forte',
                    'room_type' => 'Deluxe Room with City View',
                    'meals' => 'Breakfast included, 1 gourmet dinner',
                    'check_in' => '2025-06-15',
                    'check_out' => '2025-06-18',
                    'cancellation_policy' => 'Free cancellation up to 30 days before arrival',
                ],
    ],
            [
                'name' => 'Ski & Spa Retreat',
                'type' => 'hotel',
                'description' => 'Luxury ski-in/ski-out resort in the Swiss Alps with direct access to the slopes, world-class spa, and gourmet dining.',
                'price' => 899.99,
                'is_active' => true,
                'location' => 'Zermatt, Switzerland',
                'image' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.9,
        'hotel_details' => [
            'rooms' => 2,
            'bathrooms' => 2,
            'beds' => 1,
            'amenities' => ['pool', 'spa', 'restaurant', 'wifi'],
            'stars' => 5,
        ],
    ],
            [
                'name' => 'Premium Travel Insurance',
                'type' => 'other',
                'description' => 'Comprehensive travel insurance covering medical emergencies, trip cancellation, lost luggage, and more for complete peace of mind during your travels.',
                'price' => 79.99,
                'is_active' => true,
                'location' => 'Worldwide',
                'image' => 'https://images.unsplash.com/photo-1570129477492-45c003edd2de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                'rating' => 4.7,
                'insurance_details' => [
                    'coverage' => [
                        'Medical expenses up to $1,000,000',
                        'Trip cancellation up to $10,000',
                        'Trip interruption up to $15,000',
                        'Baggage loss up to $2,500',
                        'Baggage delay up to $500',
                        'Travel delay up to $1,000',
                        'Emergency medical evacuation',
                        '24/7 emergency assistance',
                        'Rental car damage coverage'
                    ],
                    'duration' => 'Up to 90 days',
                    'age_limit' => 'Up to 85 years',
                    'pre_existing_conditions' => 'Coverage available with premium',
                    'sports_activities' => 'Covered (except extreme sports)',
                    'covid_coverage' => true,
                    'claim_process' => 'Online submission with 24-hour processing',
                    'policy_document' => 'Available for download after purchase'
                ]
            ]
        ];

        foreach ($products as $product) {
            // Ensure JSON fields are properly encoded
            $jsonFields = [
                'hotel_details',
                'flight_details',
                'sport_details',
                'entertainment_details',
                'package_details',
                'insurance_details'
            ];

            foreach ($jsonFields as $field) {
                if (isset($product[$field]) && is_array($product[$field])) {
                    $product[$field] = json_encode($product[$field]);
                } elseif (isset($product[$field]) && is_string($product[$field])) {
                    // If it's already a string, make sure it's valid JSON
                    $product[$field] = json_encode(json_decode($product[$field], true));
                }
            }

            Product::create($product);
        }
    }
}
