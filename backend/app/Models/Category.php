<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug'
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $slug = Str::slug($value);
        $count = Category::where('slug', $slug)->count();
        $this->attributes['slug'] = $count ? "{$slug}-{$count}" : $slug;
    }

    public function officeSpace(): HasMany
    {
        return $this->hasMany(OfficeSpace::class);
    }
}
