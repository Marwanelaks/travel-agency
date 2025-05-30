<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * The users that belong to the role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * Check if the role has a specific permission.
     *
     * @param  string  $permission
     * @return bool
     */
    public function hasPermission($permission): bool
    {
        return $this->permissions()->where('slug', $permission)->exists();
    }

    /**
     * Assign a permission to the role.
     *
     * @param  string|int|Permission  $permission
     * @return void
     */
    public function assignPermission($permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        } elseif (is_int($permission)) {
            $permission = Permission::findOrFail($permission);
        }

        $this->permissions()->syncWithoutDetaching([$permission->id]);
    }

    /**
     * Remove a permission from the role.
     *
     * @param  string|int|Permission  $permission
     * @return void
     */
    public function removePermission($permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('slug', $permission)->firstOrFail();
        } elseif (is_int($permission)) {
            $permission = Permission::findOrFail($permission);
        }

        $this->permissions()->detach($permission->id);
    }
}
