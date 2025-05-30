<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RoomAmenity;
use Illuminate\Http\Request;
use App\Http\Resources\RoomAmenityResource;
use App\Http\Requests\StoreRoomAmenityRequest;
use App\Http\Requests\UpdateRoomAmenityRequest;

class RoomAmenityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $amenities = RoomAmenity::all();
        return RoomAmenityResource::collection($amenities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomAmenityRequest $request)
    {
        $amenity = RoomAmenity::create($request->validated());
        return new RoomAmenityResource($amenity);
    }

    /**
     * Display the specified resource.
     */
    public function show(RoomAmenity $roomAmenity)
    {
        return new RoomAmenityResource($roomAmenity);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomAmenityRequest $request, RoomAmenity $roomAmenity)
    {
        $roomAmenity->update($request->validated());
        return new RoomAmenityResource($roomAmenity);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoomAmenity $roomAmenity)
    {
        $roomAmenity->delete();
        return response()->noContent();
    }
}
