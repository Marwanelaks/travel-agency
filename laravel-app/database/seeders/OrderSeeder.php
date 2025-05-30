<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find users with different roles for order creation
        $customers = User::role('Random buyer')->get();
        $sellers = User::role('Seller')->get();
        
        // If we don't have enough users, create some test users
        if ($customers->isEmpty()) {
            $this->command->info('Creating random buyers for testing...');
            $buyerRole = Role::findByName('Random buyer');
            
            for ($i = 1; $i <= 3; $i++) {
                $user = User::create([
                    'name' => 'Test Buyer ' . $i,
                    'email' => 'buyer' . $i . '@example.com',
                    'password' => bcrypt('password'),
                ]);
                $user->assignRole($buyerRole);
                $customers->push($user);
            }
        }
        
        if ($sellers->isEmpty()) {
            $this->command->info('Creating sellers for testing...');
            $sellerRole = Role::findByName('Seller');
            
            for ($i = 1; $i <= 2; $i++) {
                $user = User::create([
                    'name' => 'Test Seller ' . $i,
                    'email' => 'seller' . $i . '@example.com',
                    'password' => bcrypt('password'),
                ]);
                $user->assignRole($sellerRole);
                $sellers->push($user);
            }
        }
        
        $this->command->info('Found ' . $customers->count() . ' buyers and ' . $sellers->count() . ' sellers.');

        // Sample product types for our seed data
        $productTypes = ['hotel', 'flight', 'tour', 'activity', 'car', 'cruise'];
        
        // Create 20 orders with different statuses and data
        for ($i = 0; $i < 20; $i++) {
            // Pick a random customer and seller
            $customer = $customers->random();
            $seller = $sellers->random();
            
            // Generate a status with weighted randomness (pending being most common)
            $statuses = ['pending', 'approved', 'delivered', 'cancelled'];
            $statusWeights = [50, 20, 20, 10]; // Weights for each status
            $status = $this->getRandomWeightedElement($statuses, $statusWeights);
            
            // Generate 1-3 products for each order
            $products = [];
            $total = 0;
            $numProducts = rand(1, 3);
            
            for ($j = 0; $j < $numProducts; $j++) {
                $productType = $productTypes[array_rand($productTypes)];
                $price = round(rand(50, 500) + (rand(0, 99) / 100), 2);
                $quantity = rand(1, 3);
                $subtotal = $price * $quantity;
                $total += $subtotal;
                
                // Create product data
                $products[] = [
                    'id' => 'prod_' . uniqid(),
                    'name' => $this->getProductName($productType),
                    'price' => $price,
                    'quantity' => $quantity,
                    'type' => $productType,
                    'image' => $this->getImageUrlForType($productType),
                ];
            }
            
            // Set timestamps according to status
            $createdAt = Carbon::now()->subDays(rand(1, 30))->format('Y-m-d H:i:s');
            $approvedAt = null;
            $deliveredAt = null;
            $cancelledAt = null;
            
            if ($status === 'approved' || $status === 'delivered') {
                $approvedAt = Carbon::parse($createdAt)->addHours(rand(1, 24))->format('Y-m-d H:i:s');
            }
            
            if ($status === 'delivered') {
                $deliveredAt = Carbon::parse($approvedAt)->addDays(rand(1, 3))->format('Y-m-d H:i:s');
            }
            
            if ($status === 'cancelled') {
                $cancelledAt = Carbon::parse($createdAt)->addHours(rand(1, 24))->format('Y-m-d H:i:s');
            }
            
            // Create the order
            Order::create([
                'buyer_id' => $customer->id,
                'seller_id' => $seller->id,
                'status' => $status,
                'total' => $total,
                'product_data' => $products,
                'approved_at' => $approvedAt,
                'delivered_at' => $deliveredAt,
                'cancelled_at' => $cancelledAt,
                'created_at' => $createdAt,
                'updated_at' => $status === 'pending' ? $createdAt : ($cancelledAt ?? $deliveredAt ?? $approvedAt),
            ]);
        }
        
        $this->command->info('20 sample orders have been created successfully!');
    }
    
    /**
     * Get a random element from an array with weighted probabilities
     */
    private function getRandomWeightedElement($elements, $weights)
    {
        $totalWeight = array_sum($weights);
        $randomWeight = mt_rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($elements as $key => $element) {
            $currentWeight += $weights[$key];
            if ($randomWeight <= $currentWeight) {
                return $element;
            }
        }
        
        return $elements[0]; // Fallback
    }
    
    /**
     * Get a plausible product name for the given type
     */
    private function getProductName($type)
    {
        $names = [
            'hotel' => [
                'Luxury Suite at Grand Hotel',
                'Seaside Resort Standard Room',
                'Mountain View Cabin',
                'Urban Boutique Hotel Room',
                'Executive Suite with Balcony',
            ],
            'flight' => [
                'One-way Economy Flight to Paris',
                'Business Class Return to New York',
                'First Class Flight to Tokyo',
                'Economy Plus to Barcelona',
                'Direct Flight to London',
            ],
            'tour' => [
                'Historic City Walking Tour',
                'Wine Tasting Experience',
                'Cultural Heritage Full Day Tour',
                'Adventure Hiking Trip',
                'Local Food Tasting Tour',
            ],
            'activity' => [
                'Scuba Diving Experience',
                'Yoga Retreat Day Pass',
                'Museum Entry Tickets',
                'Amusement Park Day Pass',
                'Cooking Class with Local Chef',
            ],
            'car' => [
                'Economy Car Rental',
                'Luxury Vehicle Rental',
                'SUV Weekly Rental',
                'Convertible Weekend Hire',
                'Family Van Rental',
            ],
            'cruise' => [
                '3-Day Mediterranean Cruise',
                'Caribbean Island Hopping Cruise',
                'Weekend River Cruise',
                'Luxury Yacht Private Charter',
                'All-Inclusive Ocean Cruise',
            ],
        ];
        
        $typeNames = $names[$type] ?? ['Travel Product'];
        return $typeNames[array_rand($typeNames)];
    }
    
    /**
     * Get a placeholder image URL for the product type
     */
    private function getImageUrlForType($type)
    {
        $images = [
            'hotel' => [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            ],
            'flight' => [
                'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
                'https://images.unsplash.com/photo-1507812984078-917a274065be',
                'https://images.unsplash.com/photo-1588179529959-34733efaec0d',
            ],
            'tour' => [
                'https://images.unsplash.com/photo-1533854775446-95c923f0a156',
                'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a',
                'https://images.unsplash.com/photo-1501446529957-6226bd447c46',
            ],
            'activity' => [
                'https://images.unsplash.com/photo-1527593625869-e4baa5a6f84e',
                'https://images.unsplash.com/photo-1475688621402-4257c812d6db',
                'https://images.unsplash.com/photo-1471967183320-ee018f6e114a',
            ],
            'car' => [
                'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
                'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
                'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d',
            ],
            'cruise' => [
                'https://images.unsplash.com/photo-1548574505-5e239809ee19',
                'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
                'https://images.unsplash.com/photo-1589318228476-af1945c52686',
            ],
        ];
        
        $typeImages = $images[$type] ?? ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd'];
        return $typeImages[array_rand($typeImages)];
    }
}
