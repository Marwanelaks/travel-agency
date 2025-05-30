<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Http\Requests\API\StoreRoomRequest;
use App\Http\Requests\API\UpdateRoomRequest;
use App\Models\Room;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     *
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        $rooms = Room::with(['hotel', 'roomType', 'amenities'])
            ->latest()
            ->paginate(15);

        return RoomResource::collection($rooms);
    }

    /**
     * Get rooms by hotel.
     *
     * @param Hotel $hotel
     * @return AnonymousResourceCollection
     */
    public function getByHotel(Hotel $hotel)
    {
        $rooms = $hotel->rooms()
            ->with(['roomType', 'amenities'])
            ->latest()
            ->paginate(15);

        return RoomResource::collection($rooms);
    }

    /**
     * Get available rooms for a hotel.
     *
     * @param Hotel $hotel
     * @return AnonymousResourceCollection
     */
    public function getAvailableRooms(Hotel $hotel)
    {
        $rooms = $hotel->availableRooms()
            ->with(['roomType', 'amenities'])
            ->latest()
            ->paginate(15);

        return RoomResource::collection($rooms);
    }

    /**
     * Store a newly created room in storage.
     *
     * @param StoreRoomRequest $request
     * @return JsonResponse
     */
    public function store(StoreRoomRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $room = Room::create($validated);
        
        // Attach amenities if provided
        if (isset($validated['amenities'])) {
            $room->amenities()->sync($validated['amenities']);
        }

        return response()->json([
            'message' => 'Room created successfully',
            'data' => new RoomResource($room->loadMissing(['hotel', 'roomType', 'amenities']))
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified room.
     *
     * @param Room $room
     * @return RoomResource
     */
    public function show(Room $room): RoomResource
    {
        return new RoomResource($room->loadMissing(['hotel', 'roomType', 'amenities']));
    }

    /**
     * Update the specified room in storage.
     *
     * @param UpdateRoomRequest $request
     * @param Room $room
     * @return JsonResponse
     */
    public function update(UpdateRoomRequest $request, Room $room): JsonResponse
    {
        $validated = $request->validated();
        
        $room->update($validated);
        
        // Sync amenities if provided
        if (isset($validated['amenities'])) {
            $room->amenities()->sync($validated['amenities']);
        }

        return response()->json([
            'message' => 'Room updated successfully',
            'data' => new RoomResource($room->loadMissing(['hotel', 'roomType', 'amenities']))
        ]);
    }

    /**
     * Remove the specified room from storage.
     *
     * @param Room $room
     * @return JsonResponse
     */
    public function destroy(Room $room): JsonResponse
    {
        $room->amenities()->detach();
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}
