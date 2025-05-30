<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hotel_id',
        'room_type_id',
        'room_number',
        'floor',
        'price_per_night',
        'quantity',
        'available_quantity',
        'size_sqm',
        'size_sqft',
        'images',
        'status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price_per_night' => 'decimal:2',
        'quantity' => 'integer',
        'available_quantity' => 'integer',
        'size_sqm' => 'integer',
        'size_sqft' => 'integer',
        'images' => 'array',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'deleted_at',
    ];

    /**
     * Get the hotel that owns the room.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * Get the room type of the room.
     */
    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    /**
     * The amenities that belong to the room.
     */
    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(RoomAmenity::class, 'room_room_amenity');
    }

    /**
     * Scope a query to only include available rooms.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')
                    ->where('available_quantity', '>', 0);
    }

    /**
     * Check if the room is available for booking.
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available' && $this->available_quantity > 0;
    }

    /**
     * Get the room's display name with hotel.
     *
     * @return string
     */
    public function getDisplayNameAttribute(): string
    {
        return "{$this->hotel->name} - {$this->roomType->name} ({$this->room_number})";
    }

    /**
     * Get the room's main image.
     *
     * @return string|null
     */
    public function getMainImageAttribute(): ?string
    {
        if (!empty($this->images)) {
            return $this->images[0];
        }

        return $this->roomType->images[0] ?? null;
    }
}
