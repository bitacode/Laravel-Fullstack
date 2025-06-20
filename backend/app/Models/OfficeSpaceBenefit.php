<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OfficeSpaceBenefit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'office_space_id'
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
    }

    public function officeSpace(): BelongsTo
    {
        return $this->belongsTo(OfficeSpace::class);
    }
}
