<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'unique_code',
        'discount_type',
        'discount_value',
        'min_eligible_price',
        'valid_from',
        'valid_until'
    ];


}
