<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Get the current cart for the user or session
     */
    public function getCart(Request $request): JsonResponse
    {
        $cart = $this->getCurrentCart($request);
        
        return response()->json([
            'id' => $cart->id,
            'items' => $cart->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'productId' => $item->product_id,
                    'name' => $item->name,
                    'price' => (float)$item->price,
                    'quantity' => $item->quantity,
                    'image' => $item->image,
                    'subtotal' => (float)$item->subtotal,
                ];
            }),
            'subtotal' => (float)$cart->subtotal,
            'totalItems' => $cart->total_items,
            'createdAt' => $cart->created_at,
            'updatedAt' => $cart->updated_at,
        ]);
    }

    /**
     * Add an item to the cart
     */
    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'productId' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCurrentCart($request);
        $product = Product::findOrFail($request->productId);

        // Check if item already exists in cart
        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            // Update existing item quantity
            $existingItem->quantity += $request->quantity;
            $existingItem->save();
        } else {
            // Create new cart item
            $cart->items()->create([
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $request->quantity,
                'image' => $product->image,
            ]);
        }

        // Recalculate cart totals
        $cart->calculateTotals();
        
        return $this->getCart($request);
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, $itemId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCurrentCart($request);
        $item = $cart->items()->findOrFail($itemId);
        
        $item->quantity = $request->quantity;
        $item->save();
        
        // Recalculate cart totals
        $cart->calculateTotals();
        
        return $this->getCart($request);
    }

    /**
     * Remove an item from the cart
     */
    public function removeItem(Request $request, $itemId): JsonResponse
    {
        $cart = $this->getCurrentCart($request);
        $item = $cart->items()->findOrFail($itemId);
        
        $item->delete();
        
        // Recalculate cart totals
        $cart->calculateTotals();
        
        return $this->getCart($request);
    }

    /**
     * Clear the entire cart
     */
    public function clearCart(Request $request): JsonResponse
    {
        $cart = $this->getCurrentCart($request);
        
        // Delete all items
        $cart->items()->delete();
        
        // Reset cart totals
        $cart->subtotal = 0;
        $cart->total_items = 0;
        $cart->save();
        
        return $this->getCart($request);
    }

    /**
     * Get or create a cart for the current user or session
     */
    private function getCurrentCart(Request $request): Cart
    {
        // Get user ID if authenticated
        $userId = Auth::id();
        
        // Get or create session ID for guests
        $sessionId = $request->cookie('cart_session_id') ?? Str::uuid();
        
        // Look for existing cart
        $cart = null;
        
        if ($userId) {
            // Try to find cart by user ID
            $cart = Cart::where('user_id', $userId)->first();
            
            if (!$cart) {
                // Try to find cart by session ID and associate it with the user
                $sessionCart = Cart::where('session_id', $sessionId)->first();
                
                if ($sessionCart) {
                    // Transfer session cart to user
                    $sessionCart->user_id = $userId;
                    $sessionCart->session_id = null;
                    $sessionCart->save();
                    $cart = $sessionCart;
                }
            }
        } else {
            // Try to find cart by session ID for guests
            $cart = Cart::where('session_id', $sessionId)->first();
        }
        
        // Create new cart if none exists
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $userId,
                'session_id' => $userId ? null : $sessionId,
                'subtotal' => 0,
                'total_items' => 0,
            ]);
        }
        
        // Set cookie for guest users to keep their cart
        if (!$userId) {
            cookie()->queue('cart_session_id', $sessionId, 60 * 24 * 30); // 30 days
        }
        
        return $cart;
    }
}
