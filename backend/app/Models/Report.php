<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'booking_transaction_id',
        'is_traced'
    ];

    public function setNameAttribute($value) {
        $this->attributes['name'] = $value ?: 'report-' . (self::withTrashed()->count() + 1);
    }

    public function bookingTransaction(): BelongsTo
    {
        return $this->belongsTo(BookingTransaction::class, 'booking_transaction_id');
    }

    public function officeSpace(): HasOneThrough
    {
        return $this->hasOneThrough(OfficeSpace::class, BookingTransaction::class, 'id', 'id', 'booking_transaction_id', 'office_space_id');
    }

    public function city(): HasOneThrough
    {
        return $this->hasOneThrough(City::class, OfficeSpace::class, 'id', 'id', 'city_id', 'office_space_id');
    }

}