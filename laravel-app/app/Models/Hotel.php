<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hotel extends Model
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
        'short_description',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'phone',
        'email',
        'website',
        'star_rating',
        'check_in_time',
        'check_out_time',
        'amenities',
        'images',
        'status',
        'featured',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
        'star_rating' => 'integer',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'featured' => 'boolean',
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
     * Get the rooms for the hotel.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    /**
     * Get the available rooms for the hotel.
     */
    public function availableRooms(): HasMany
    {
        return $this->hasMany(Room::class)->where('status', 'available')
            ->where('available_quantity', '>', 0);
    }

    /**
     * Scope a query to only include featured hotels.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to only include active hotels.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Get the hotel's full address.
     *
     * @return string
     */
    public function getFullAddressAttribute(): string
    {
        $address = [
            $this->address,
            $this->city,
            $this->state,
            $this->country,
            $this->postal_code,
        ];

        return implode(', ', array_filter($address));
    }

    /**
     * Get the hotel's main image.
     *
     * @return string|null
     */
    public function getMainImageAttribute(): ?string
    {
        return !empty($this->images) ? $this->images[0] : null;
    }

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }
}
