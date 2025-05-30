<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'base_occupancy',
        'max_occupancy',
        'max_extra_beds',
        'extra_bed_charge',
        'base_price',
        'amenities',
    ];

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'base_occupancy' => 'integer',
        'max_occupancy' => 'integer',
        'max_extra_beds' => 'integer',
        'extra_bed_charge' => 'decimal:2',
        'amenities' => 'array',
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
     * Get the rooms of this type.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    /**
     * The amenities that belong to the room type.
     */
    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(RoomAmenity::class, 'room_type_amenity', 'room_type_id', 'amenity_id');
    }

    /**
     * Scope a query to only include room types that can accommodate a given number of guests.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $guests
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCanAccommodate($query, $guests)
    {
        return $query->where('max_occupancy', '>=', $guests);
    }

    /**
     * Get the room type's display name with occupancy.
     *
     * @return string
     */
    public function getDisplayNameWithOccupancyAttribute(): string
    {
        return "{$this->name} (Max: {$this->max_occupancy} " . str_plural('guest', $this->max_occupancy) . ')';
    }

    /**
     * Check if the room type allows extra beds.
     *
     * @return bool
     */
    public function allowsExtraBeds(): bool
    {
        return $this->max_extra_beds > 0;
    }
}
