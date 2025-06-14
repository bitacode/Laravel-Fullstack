<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class OfficeSpacePhoto extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'photo',
        'office_space_id'
    ];
    
    public function officeSpace(): BelongsTo
    {
        return $this->belongsTo(OfficeSpace::class);
    } 
}
