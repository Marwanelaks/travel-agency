<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *   schema="Product",
 *   required={"name", "type", "price"},
 *   @OA\Property(property="id", type="integer"),
 *   @OA\Property(property="name", type="string", example="Luxury Hotel"),
 *   @OA\Property(property="description", type="string", nullable=true, example="A beautiful luxury hotel with sea view"),
 *   @OA\Property(property="type", type="string", enum={"hotel", "flight", "sport", "entertainment", "package", "other"}, example="hotel"),
 *   @OA\Property(property="price", type="number", format="float", example=299.99),
 *   @OA\Property(property="location", type="string"),
 *   @OA\Property(property="image", type="string"),
 *   @OA\Property(property="is_active", type="boolean", example=true),
 *   @OA\Property(property="start_date", type="string", format="date"),
 *   @OA\Property(property="end_date", type="string", format="date"),
 *   @OA\Property(property="capacity", type="integer"),
 *   @OA\Property(property="hotel_details", type="object"),
 *   @OA\Property(property="flight_details", type="object"),
 *   @OA\Property(property="sport_details", type="object"),
 *   @OA\Property(property="entertainment_details", type="object"),
 *   @OA\Property(property="details", type="object", example={"rooms": 2, "bathrooms": 2, "beds": 1}),
 *   @OA\Property(property="created_at", type="string", format="date-time"),
 *   @OA\Property(property="updated_at", type="string", format="date-time"),
 *   @OA\Property(property="deleted_at", type="string", format="date-time", nullable=true)
 * )
 */
class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'description',
        'price',
        'location',
        'image',
        'rating',
        'is_active',
        'start_date',
        'end_date',
        'capacity',
        'hotel_details',
        'flight_details',
        'sport_details',
        'entertainment_details',
        'package_details',
        'insurance_details'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'float',
        'capacity' => 'integer',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'hotel_details' => 'array',
        'flight_details' => 'array',
        'sport_details' => 'array',
        'entertainment_details' => 'array',
        'package_details' => 'array',
        'insurance_details' => 'array',
        'details' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include products of a given type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
