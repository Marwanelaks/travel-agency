<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @group Products
 * 
 * APIs for managing products
 */
class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     *
     * @queryParam type string Filter by product type. Example: hotel,flight
     * @queryParam search string Search term for product name or description.
     * @queryParam is_active boolean Filter by active status.
     * 
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Luxury Hotel",
     *       "type": "hotel",
     *       "description": "A beautiful luxury hotel",
     *       "price": 299.99,
     *       "is_active": true,
     *       "created_at": "2023-01-01T00:00:00.000000Z",
     *       "updated_at": "2023-01-01T00:00:00.000000Z"
     *     }
     *   ],
     *   "links": {
     *     "first": "http://example.com/api/products?page=1",
     *     "last": "http://example.com/api/products?page=1",
     *     "prev": null,
     *     "next": null
     *   },
     *   "meta": {
     *     "current_page": 1,
     *     "from": 1,
     *     "last_page": 1,
     *     "path": "http://example.com/api/products",
     *     "per_page": 15,
     *     "to": 1,
     *     "total": 1
     *   }
     * }
     */
    /**
     * @OA\Get(
     *     path="/api/products",
     *     summary="Get list of products",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Filter by product type",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for product name or description",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="is_active",
     *         in="query",
     *         description="Filter by active status",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Product")),
     *             @OA\Property(property="links", type="object"),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Apply filters if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Default to only active products if not specified
        $isActive = $request->has('is_active') ? $request->boolean('is_active') : true;
        $query->where('is_active', $isActive);

        // Get paginated results with all necessary fields
        $products = $query->paginate()->toArray();

        // Transform the data to match the frontend's expected format
        $transformedData = [
            'data' => $products['data'],
            'meta' => [
                'current_page' => $products['current_page'],
                'from' => $products['from'] ?? null,
                'last_page' => $products['last_page'],
                'path' => $products['path'],
                'per_page' => (int) $products['per_page'],
                'to' => $products['to'] ?? null,
                'total' => $products['total'],
            ],
            'links' => $products['links']
        ];

        return response()->json($transformedData);
    }

    /**
     * Store a newly created product in storage.
     *
     * @bodyParam name string required The name of the product. Example: Luxury Hotel
     * @bodyParam type string required The type of product (hotel, flight, etc.). Example: hotel
     * @bodyParam description string A description of the product.
     * @bodyParam price number required The price of the product. Example: 299.99
     * @bodyParam is_active boolean Whether the product is active. Defaults to true.
     * 
     * @response 201 {
     *   "data": {
     *     "name": "Luxury Hotel",
     *     "type": "hotel",
     *     "description": "A beautiful luxury hotel",
     *     "price": 299.99,
     *     "is_active": true,
     *     "updated_at": "2023-01-01T00:00:00.000000Z",
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "id": 1
     *   },
     *   "message": "Product created successfully"
     * }
     */
    /**
     * @OA\Post(
     *     path="/api/products",
     *     summary="Create a new product",
     *     tags={"Products"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Product")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product created successfully",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/Product"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:hotel,flight,sport,entertainment,package,other',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
$data['is_active'] = $request->input('is_active', true);
$data['hotel_details'] = $request->input('hotel_details');
$data['flight_details'] = $request->input('flight_details');
$data['sport_details'] = $request->input('sport_details');
$data['entertainment_details'] = $request->input('entertainment_details');
$product = Product::create($data);

        return response()->json([
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Display the specified product.
     *
     * @urlParam id int required The ID of the product. Example: 1
     * 
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "name": "Luxury Hotel",
     *     "type": "hotel",
     *     "description": "A beautiful luxury hotel",
     *     "price": 299.99,
     *     "is_active": true,
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "updated_at": "2023-01-01T00:00:00.000000Z"
     *   }
     * }
     */
    /**
     * @OA\Get(
     *     path="/api/products/{id}",
     *     summary="Get a single product",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Product ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/Product")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json(['data' => $product]);
    }

    /**
     * Update the specified product in storage.
     *
     * @urlParam id int required The ID of the product. Example: 1
     * @bodyParam name string The name of the product. Example: Updated Hotel Name
     * @bodyParam type string The type of product (hotel, flight, etc.). Example: hotel
     * @bodyParam description string A description of the product.
     * @bodyParam price number The price of the product. Example: 349.99
     * @bodyParam is_active boolean Whether the product is active.
     * 
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "name": "Updated Hotel Name",
     *     "type": "hotel",
     *     "description": "An updated description",
     *     "price": 349.99,
     *     "is_active": true,
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "updated_at": "2023-01-02T00:00:00.000000Z"
     *   },
     *   "message": "Product updated successfully"
     * }
     */
    /**
     * @OA\Put(
     *     path="/api/products/{id}",
     *     summary="Update a product",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Product ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Product")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product updated successfully",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/Product"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:hotel,flight,sport,entertainment,package,other',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
if ($request->has('hotel_details')) $data['hotel_details'] = $request->input('hotel_details');
if ($request->has('flight_details')) $data['flight_details'] = $request->input('flight_details');
if ($request->has('sport_details')) $data['sport_details'] = $request->input('sport_details');
if ($request->has('entertainment_details')) $data['entertainment_details'] = $request->input('entertainment_details');
$product->update($data);

        return response()->json([
            'data' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Remove the specified product from storage.
     *
     * @urlParam id int required The ID of the product. Example: 1
     * 
     * @response 204
     */
    /**
     * @OA\Delete(
     *     path="/api/products/{id}",
     *     summary="Delete a product",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Product ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product deleted successfully",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->noContent();
    }

    /**
     * Toggle the active status of the specified product.
     *
     * @urlParam id int required The ID of the product. Example: 1
     * @bodyParam is_active boolean required The new active status. Example: false
     * 
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "name": "Luxury Hotel",
     *     "type": "hotel",
     *     "is_active": false,
     *     "created_at": "2023-01-01T00:00:00.000000Z",
     *     "updated_at": "2023-01-03T00:00:00.000000Z"
     *   },
     *   "message": "Product status updated successfully"
     * }
     */
    public function toggleStatus(Request $request, $id)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $product = Product::findOrFail($id);
        $product->is_active = $request->is_active;
        $product->save();

        return response()->json([
            'data' => $product,
            'message' => 'Product status updated successfully'
        ]);
    }
}
