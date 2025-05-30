<?php

namespace App\Http\Controllers\API;

use OpenApi\Annotations as OA; // Swagger annotations

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
use App\Http\Requests\API\StoreHotelRequest;
use App\Http\Requests\API\UpdateHotelRequest;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class HotelController extends Controller
{
    /**
     * Display a listing of the hotels.
     *
     * @OA\Get(
     *     path="/api/hotels",
     *     summary="Get list of hotels",
     *     tags={"Hotels"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Successful operation")
     * )
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        $hotels = Hotel::with(['rooms', 'availableRooms'])
            ->latest()
            ->paginate(15);

        return HotelResource::collection($hotels);
    }

    /**
     * Store a newly created hotel in storage.
     *
     * @OA\Post(
     *     path="/api/hotels",
     *     summary="Create a new hotel",
     *     tags={"Hotels"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(required=true, description="Hotel data"),
     *     @OA\Response(response=201, description="Hotel created successfully")
     * )
     *
     * @param StoreHotelRequest $request
     * @return JsonResponse
     */
    public function store(StoreHotelRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        if (!isset($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        }

        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully',
            'data' => new HotelResource($hotel->loadMissing(['rooms', 'availableRooms']))
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified hotel.
     *
     * @OA\Get(
     *     path="/api/hotels/{id}",
     *     summary="Get a hotel by ID",
     *     tags={"Hotels"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Successful operation")
     * )
     *
     * @param Hotel $hotel
     * @return HotelResource
     */
    public function show(Hotel $hotel): HotelResource
    {
        return new HotelResource($hotel->loadMissing(['rooms', 'availableRooms', 'rooms.roomType', 'rooms.amenities']));
    }

    /**
     * Update the specified hotel in storage.
     *
     * @OA\Put(
     *     path="/api/hotels/{id}",
     *     summary="Update a hotel",
     *     tags={"Hotels"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, description="Hotel data"),
     *     @OA\Response(response=200, description="Hotel updated successfully")
     * )
     *
     * @param UpdateHotelRequest $request
     * @param Hotel $hotel
     * @return JsonResponse
     */
    public function update(UpdateHotelRequest $request, Hotel $hotel): JsonResponse
    {
        $validated = $request->validated();
        
        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        }

        $hotel->update($validated);

        return response()->json([
            'message' => 'Hotel updated successfully',
            'data' => new HotelResource($hotel->loadMissing(['rooms', 'availableRooms']))
        ]);
    }

    /**
     * Remove the specified hotel from storage.
     *
     * @OA\Delete(
     *     path="/api/hotels/{id}",
     *     summary="Delete a hotel",
     *     tags={"Hotels"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Hotel deleted successfully")
     * )
     *
     * @param Hotel $hotel
     * @return JsonResponse
     */
    public function destroy(Hotel $hotel): JsonResponse
    {
        DB::transaction(function () use ($hotel) {
            // Delete related rooms first
            $hotel->rooms()->delete();
            // Then delete the hotel
            $hotel->delete();
        });

        return response()->json([
            'message' => 'Hotel deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }

    /**
     * Get featured hotels.
     *
     * @return AnonymousResourceCollection
     */
    public function featured()
    {
        $hotels = Hotel::where('featured', true)
            ->where('status', 'published')
            ->with(['rooms', 'availableRooms'])
            ->take(10)
            ->get();

        return HotelResource::collection($hotels);
    }

    /**
     * Search hotels by various criteria.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function search(Request $request)
    {
        $query = Hotel::query()->with(['rooms', 'availableRooms']);

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->input('city') . '%');
        }

        if ($request->has('country')) {
            $query->where('country', 'like', '%' . $request->input('country') . '%');
        }

        if ($request->has('min_rating')) {
            $query->where('star_rating', '>=', $request->input('min_rating'));
        }

        if ($request->has('check_in') && $request->has('check_out')) {
            // This is a simplified example - you'd need to implement actual availability checking
            $query->whereHas('availableRooms');
        }

        $hotels = $query->where('status', 'published')
            ->paginate(15);

        return HotelResource::collection($hotels);
    }
}
