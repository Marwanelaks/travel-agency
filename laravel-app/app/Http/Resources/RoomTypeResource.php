<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomTypeResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'base_occupancy' => $this->base_occupancy,
            'max_occupancy' => $this->max_occupancy,
            'max_extra_beds' => $this->max_extra_beds,
            'extra_bed_charge' => (float) $this->extra_bed_charge,
            'base_price' => (float) $this->base_price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Relationships
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'amenities' => RoomAmenityResource::collection($this->whenLoaded('amenities')),
        ];
    }
}
