<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

/**
 * @OA\Tag(
 *     name="Order Management",
 *     description="Order management for sellers and buyers"
 * )
 */
class OrderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/orders",
     *     summary="List orders (role-based)",
     *     tags={"Order Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of orders")
     * )
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->hasRole('SuperAdmin')) {
            return Order::with(['buyer', 'seller'])->paginate(20);
        } elseif ($user->hasRole('Seller')) {
            return Order::with(['buyer', 'seller'])->where('seller_id', $user->id)->paginate(20);
        } else {
            // Buyer
            return Order::with(['buyer', 'seller'])->where('buyer_id', $user->id)->paginate(20);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/orders",
     *     summary="Create a new order (buyer only)",
     *     tags={"Order Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"seller_id", "product_data", "total"},
     *             @OA\Property(property="seller_id", type="integer"),
     *             @OA\Property(property="product_data", type="object"),
     *             @OA\Property(property="total", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Order created")
     * )
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user->hasAnyRole(['Random buyer', 'Customer'])) {
            return response()->json(['error' => 'Only buyers can create orders.'], 403);
        }
        $validated = $request->validate([
            'seller_id' => 'required|exists:users,id',
            'product_data' => 'required|array',
            'total' => 'required|numeric|min:0',
        ]);
        $order = Order::create([
            'buyer_id' => $user->id,
            'seller_id' => $validated['seller_id'],
            'product_data' => $validated['product_data'],
            'total' => $validated['total'],
            'status' => 'pending',
        ]);
        return response()->json($order->load(['buyer', 'seller']), 201);
    }

    /**
     * @OA\Get(
     *     path="/api/orders/{id}",
     *     summary="View order details (role-based)",
     *     tags={"Order Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order details")
     * )
     */
    public function show($id)
    {
        $order = Order::with(['buyer', 'seller'])->findOrFail($id);
        $user = Auth::user();
        if ($user->hasRole('SuperAdmin') || $order->seller_id === $user->id || $order->buyer_id === $user->id) {
            return $order;
        }
        return response()->json(['error' => 'Forbidden'], 403);
    }

    /**
     * @OA\Put(
     *     path="/api/orders/{id}/approve",
     *     summary="Approve order (seller only)",
     *     tags={"Order Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order approved")
     * )
     */
    public function approve($id)
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);
        if ($user->hasRole('Seller') && $order->seller_id === $user->id) {
            $order->status = 'approved';
            $order->approved_at = now();
            $order->save();
            return response()->json($order);
        }
        return response()->json(['error' => 'Forbidden'], 403);
    }

    /**
     * @OA\Put(
     *     path="/api/orders/{id}/deliver",
     *     summary="Mark order as delivered (seller only)",
     *     tags={"Order Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order delivered")
     * )
     */
    public function deliver($id)
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);
        if ($user->hasRole('Seller') && $order->seller_id === $user->id && $order->status === 'approved') {
            $order->status = 'delivered';
            $order->delivered_at = now();
            $order->save();
            return response()->json($order);
        }
        return response()->json(['error' => 'Forbidden or invalid status'], 403);
    }

    /**
     * @OA\Put(
     *     path="/api/orders/{id}/cancel",
     *     summary="Cancel order (buyer only)",
     *     tags={"Order Management"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Order cancelled")
     * )
     */
    public function cancel($id)
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);
        if (($user->hasAnyRole(['Random buyer', 'Customer']) && $order->buyer_id === $user->id) && in_array($order->status, ['pending', 'approved'])) {
            $order->status = 'cancelled';
            $order->cancelled_at = now();
            $order->save();
            return response()->json($order);
        }
        return response()->json(['error' => 'Forbidden or invalid status'], 403);
    }
}
