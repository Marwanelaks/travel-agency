<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\HotelController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\RoomController;
use App\Http\Controllers\API\RoomTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Public product routes
Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index']);
Route::get('/products/{product}', [\App\Http\Controllers\ProductController::class, 'show']);

// Cart routes (accessible to both guests and authenticated users)
Route::get('/cart', [CartController::class, 'getCart']);
Route::post('/cart/items', [CartController::class, 'addItem']);
Route::put('/cart/items/{itemId}', [CartController::class, 'updateItem']);
Route::delete('/cart/items/{itemId}', [CartController::class, 'removeItem']);
Route::delete('/cart', [CartController::class, 'clearCart']);

// Dashboard routes
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);

// Get current user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protected routes (require authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    // Authenticated user info route
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    
    // Hotel Routes
    Route::apiResource('hotels', HotelController::class);
    
    // Room Routes
    Route::apiResource('rooms', RoomController::class);
    Route::get('hotels/{hotel}/rooms', [RoomController::class, 'getByHotel']);
    
    // Room Type Routes
    Route::apiResource('room-types', RoomTypeController::class);
    
    // Room Amenity Routes
    Route::apiResource('room-amenities', \App\Http\Controllers\API\RoomAmenityController::class);

    // Protected Product Management routes
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::post('products/{product}/toggle-status', [ProductController::class, 'toggleStatus']);
    
    // User Management
    Route::apiResource('users', \App\Http\Controllers\API\UserController::class);
    Route::post('users/{id}/toggle-status', [\App\Http\Controllers\API\UserController::class, 'toggleStatus']);
    Route::post('users/{id}/approve', [\App\Http\Controllers\API\UserController::class, 'approve']);
    Route::get('roles', [\App\Http\Controllers\API\UserController::class, 'roles']);
    
    // Hotel Routes
    Route::get('hotels/featured', [HotelController::class, 'featured']);
    Route::get('hotels/search', [HotelController::class, 'search']);
});

// Public routes
Route::post('login', [\App\Http\Controllers\API\AuthTokenController::class, 'login']);
Route::get('hotels/{hotel}/available-rooms', [RoomController::class, 'getAvailableRooms']);
