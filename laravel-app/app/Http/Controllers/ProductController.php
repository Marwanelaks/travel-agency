<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Get all products
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        // In a real application, this would fetch actual data from the database
        // For now, we're returning mock data
        $products = [
            [
                'id' => 1,
                'name' => 'Deluxe Ocean View Room',
                'type' => 'hotel',
                'price' => 299.99,
                'location' => 'Maldives',
                'description' => 'Luxurious ocean view room with private balcony',
                'status' => 'active',
                'createdAt' => '2025-05-25',
            ],
            [
                'id' => 2,
                'name' => 'Return Flight to Paris',
                'type' => 'flight',
                'price' => 450.00,
                'location' => 'Paris',
                'description' => 'Return flight to Paris from London with premium economy seats',
                'status' => 'active',
                'createdAt' => '2025-05-24',
            ],
            [
                'id' => 3,
                'name' => 'Snorkeling Adventure',
                'type' => 'activity',
                'price' => 75.00,
                'location' => 'Great Barrier Reef',
                'description' => 'Guided snorkeling tour of the Great Barrier Reef',
                'status' => 'active',
                'createdAt' => '2025-05-23',
            ],
            [
                'id' => 4,
                'name' => 'European Vacation Bundle',
                'type' => 'package',
                'price' => 1899.99,
                'location' => 'Europe',
                'description' => 'Two-week tour of major European cities with premium accommodations',
                'status' => 'active',
                'createdAt' => '2025-05-22',
            ],
            [
                'id' => 5,
                'name' => 'Mountain View Cabin',
                'type' => 'hotel',
                'price' => 189.99,
                'location' => 'Swiss Alps',
                'description' => 'Cozy cabin with stunning views of the Swiss Alps',
                'status' => 'active',
                'createdAt' => '2025-05-21',
            ],
            [
                'id' => 6,
                'name' => 'Scuba Diving Certification',
                'type' => 'activity',
                'price' => 350.00,
                'location' => 'Bali',
                'description' => 'Complete PADI scuba diving certification course',
                'status' => 'active',
                'createdAt' => '2025-05-20',
            ],
            [
                'id' => 7,
                'name' => 'Business Class to Tokyo',
                'type' => 'flight',
                'price' => 1200.00,
                'location' => 'Tokyo',
                'description' => 'Business class flight to Tokyo with premium services',
                'status' => 'active',
                'createdAt' => '2025-05-19',
            ],
            [
                'id' => 8,
                'name' => 'Southeast Asia Tour',
                'type' => 'package',
                'price' => 2499.99,
                'location' => 'Southeast Asia',
                'description' => 'Three-week tour of Thailand, Vietnam, and Cambodia',
                'status' => 'active',
                'createdAt' => '2025-05-18',
            ]
        ];

        return response()->json($products);
    }

    /**
     * Get a specific product by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id): JsonResponse
    {
        // Mock product data for demonstration
        $product = [
            'id' => $id,
            'name' => 'Deluxe Ocean View Room',
            'type' => 'hotel',
            'price' => 299.99,
            'location' => 'Maldives',
            'description' => 'Luxurious ocean view room with private balcony',
            'features' => [
                'Ocean view',
                'King-size bed',
                'Private balcony',
                'Room service',
                'Free WiFi',
                'Mini bar'
            ],
            'images' => [
                'https://example.com/room1.jpg',
                'https://example.com/room2.jpg',
                'https://example.com/room3.jpg'
            ],
            'status' => 'active',
            'createdAt' => '2025-05-25',
        ];

        return response()->json($product);
    }
}
