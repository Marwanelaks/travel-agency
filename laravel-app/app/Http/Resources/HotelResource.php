<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
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
            'short_description' => $this->short_description,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'postal_code' => $this->postal_code,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'full_address' => $this->full_address,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'star_rating' => $this->star_rating,
            'check_in_time' => $this->check_in_time,
            'check_out_time' => $this->check_out_time,
            'amenities' => $this->amenities,
            'images' => $this->images,
            'main_image' => $this->main_image,
            'status' => $this->status,
            'featured' => $this->featured,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->whenNotNull($this->deleted_at),
            // Relationships
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'available_rooms' => RoomResource::collection($this->whenLoaded('availableRooms')),
        ];
    }
}
