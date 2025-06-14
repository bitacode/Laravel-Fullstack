<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class City extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'photo',
        'slug'
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $slug = Str::slug($value);
        $count = City::where('slug', $slug)->count();
        $this->attributes['slug'] = $count ? "{$slug}-{$count}" : $slug;
    }

    public function officeSpace(): HasMany
    {
        return $this->hasMany(OfficeSpace::class);
    }
}
