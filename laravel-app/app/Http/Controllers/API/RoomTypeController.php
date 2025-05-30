<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomTypeResource;
use App\Http\Requests\API\StoreRoomTypeRequest;
use App\Http\Requests\API\UpdateRoomTypeRequest;
use App\Models\RoomType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the room types.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        $roomTypes = RoomType::with(['rooms', 'amenities'])
            ->latest()
            ->paginate(15);

        return RoomTypeResource::collection($roomTypes);
    }

    /**
     * Store a newly created room type in storage.
     *
     * @param StoreRoomTypeRequest $request
     * @return JsonResponse
     */
    public function store(StoreRoomTypeRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        if (!isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $roomType = RoomType::create($validated);
        
        // Attach amenities if provided
        if (isset($validated['amenities'])) {
            $roomType->amenities()->sync($validated['amenities']);
        }

        return response()->json([
            'message' => 'Room type created successfully',
            'data' => new RoomTypeResource($roomType->loadMissing(['rooms', 'amenities']))
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified room type.
     *
     * @param RoomType $roomType
     * @return RoomTypeResource
     */
    public function show(RoomType $roomType): RoomTypeResource
    {
        return new RoomTypeResource($roomType->loadMissing(['rooms', 'amenities']));
    }

    /**
     * Update the specified room type in storage.
     *
     * @param UpdateRoomTypeRequest $request
     * @param RoomType $roomType
     * @return JsonResponse
     */
    public function update(UpdateRoomTypeRequest $request, RoomType $roomType): JsonResponse
    {
        $validated = $request->validated();
        
        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $roomType->update($validated);
        
        // Sync amenities if provided
        if (isset($validated['amenities'])) {
            $roomType->amenities()->sync($validated['amenities']);
        }

        return response()->json([
            'message' => 'Room type updated successfully',
            'data' => new RoomTypeResource($roomType->loadMissing(['rooms', 'amenities']))
        ]);
    }

    /**
     * Remove the specified room type from storage.
     *
     * @param RoomType $roomType
     * @return JsonResponse
     */
    public function destroy(RoomType $roomType): JsonResponse
    {
        try {
            // Check if there are any rooms using this type
            if ($roomType->rooms()->exists()) {
                return response()->json([
                    'message' => 'Cannot delete room type that is in use by rooms'
                ], Response::HTTP_CONFLICT);
            }

            // Delete any related amenities in the pivot table
            $roomType->amenities()->detach();
            
            // Delete the room type
            $roomType->delete();

            return response()->json(null, Response::HTTP_NO_CONTENT);
            
        } catch (\Exception $e) {
            \Log::error('Error deleting room type: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete room type',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
