<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;

class OfficeSpace extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'thumbnail',
        'is_open',
        'is_full_booked',
        'price',
        'duration',
        'address',
        'about',
        'slug',
        'category_id',
        'city_id',
        'contact_id',
        'user_id',
        'registration_id',
    ];

    protected $guarded = ['id'];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        
        if (!$this->exists) {
            $slug = Str::slug($value);
            $count = OfficeSpace::where('slug', $slug)->count();
            $this->attributes['slug'] = $count ? "{$slug}-{$count}" : $slug;
        }
    }

    public function photos(): HasMany
    {
        return $this->hasMany(OfficeSpacePhoto::class);
    }

    public function benefits(): HasMany 
    {
        return $this->hasMany(OfficeSpaceBenefit::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(OfficeContact::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function city(): BelongsTo 
    {
        return $this->belongsTo(City::class);
    }

    public function user(): BelongsTo 
    {
        return $this->belongsTo(User::class);
    }

    public function registration(): BelongsTo 
    {
        return $this->belongsTo(Registration::class);
    }

    public function scopeForUser(Builder $query, $user)
    {
        if ($user->role === 'admin') {
            return $query;
        }
        
        return $query->where('user_id', $user->id);
    }

}
