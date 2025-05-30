<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hotel_id' => $this->hotel_id,
            'room_type_id' => $this->room_type_id,
            'room_number' => $this->room_number,
            'price_per_night' => (float) $this->price_per_night,
            'quantity' => $this->quantity,
            'available_quantity' => $this->available_quantity,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->whenNotNull($this->deleted_at),
            // Relationships
            'hotel' => new HotelResource($this->whenLoaded('hotel')),
            'room_type' => new RoomTypeResource($this->whenLoaded('roomType')),
            'amenities' => RoomAmenityResource::collection($this->whenLoaded('amenities')),
        ];
    }
}
