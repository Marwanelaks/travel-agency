<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomAmenityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => is_object($this->resource) && property_exists($this->resource, 'id') ? $this->resource->id : $this->resource,
            'name' => is_object($this->resource) && property_exists($this->resource, 'name') ? $this->resource->name : $this->resource,
            'icon' => is_object($this->resource) && property_exists($this->resource, 'icon') ? $this->resource->icon : $this->resource,
            'created_at' => is_object($this->resource) && property_exists($this->resource, 'created_at') ? $this->resource->created_at : null,
            'updated_at' => is_object($this->resource) && property_exists($this->resource, 'updated_at') ? $this->resource->updated_at : null,
            // Relationships
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'room_types' => RoomTypeResource::collection($this->whenLoaded('roomTypes')),
        ];
    }
}
