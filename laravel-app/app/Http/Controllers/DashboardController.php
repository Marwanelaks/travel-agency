<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics and data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        // In a real application, this would fetch actual data from the database
        // For now, we're returning mock data
        $dashboardData = [
            'stats' => [
                [
                    'title' => 'Total Users',
                    'value' => '3,842',
                    'change' => '+12.5%',
                    'trend' => 'up',
                ],
                [
                    'title' => 'Active Bookings',
                    'value' => '624',
                    'change' => '+4.3%',
                    'trend' => 'up',
                ],
                [
                    'title' => 'Hotel Products',
                    'value' => '156',
                    'change' => '+8.7%',
                    'trend' => 'up',
                ],
                [
                    'title' => 'Total Revenue',
                    'value' => '$128,429',
                    'change' => '+18.2%',
                    'trend' => 'up',
                ],
            ],
            'revenueData' => [
                ['month' => 'Jan', 'revenue' => 1200],
                ['month' => 'Feb', 'revenue' => 1800],
                ['month' => 'Mar', 'revenue' => 1600],
                ['month' => 'Apr', 'revenue' => 2200],
                ['month' => 'May', 'revenue' => 2400],
                ['month' => 'Jun', 'revenue' => 2100],
                ['month' => 'Jul', 'revenue' => 2800],
                ['month' => 'Aug', 'revenue' => 3200],
                ['month' => 'Sep', 'revenue' => 3000],
                ['month' => 'Oct', 'revenue' => 3400],
                ['month' => 'Nov', 'revenue' => 3100],
                ['month' => 'Dec', 'revenue' => 3800],
            ],
            'productDistribution' => [
                ['name' => 'Hotels', 'value' => 156],
                ['name' => 'Flights', 'value' => 89],
                ['name' => 'Sports', 'value' => 42],
                ['name' => 'Entertainment', 'value' => 76],
                ['name' => 'Packages', 'value' => 38],
            ],
            'recentProducts' => [
                [
                    'id' => 1,
                    'name' => 'Deluxe Ocean View Room',
                    'type' => 'hotel',
                    'price' => 299.99,
                    'location' => 'Maldives',
                    'createdAt' => '2025-05-25',
                ],
                [
                    'id' => 2,
                    'name' => 'Return Flight to Paris',
                    'type' => 'flight',
                    'price' => 450.00,
                    'location' => 'Paris',
                    'createdAt' => '2025-05-24',
                ],
                [
                    'id' => 3,
                    'name' => 'Snorkeling Adventure',
                    'type' => 'activity',
                    'price' => 75.00,
                    'location' => 'Great Barrier Reef',
                    'createdAt' => '2025-05-23',
                ],
                [
                    'id' => 4,
                    'name' => 'European Vacation Bundle',
                    'type' => 'package',
                    'price' => 1899.99,
                    'location' => 'Europe',
                    'createdAt' => '2025-05-22',
                ],
            ]
        ];

        return response()->json($dashboardData);
    }
}
