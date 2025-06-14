<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OfficeContact extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'role',
        'photo',
        'telephone_number',
        'whatsapp_number',
        'office_space_id'
    ];

    public function officeSpace(): BelongsTo
    {
        return $this->belongsTo(OfficeSpace::class);
    }
}
