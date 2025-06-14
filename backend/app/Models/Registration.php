<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Registration extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'bank_name_primary',
        'bank_name_secondary',
        'bank_account_primary',
        'bank_account_secondary',
        'is_approved',
        'approved_by',
        'approved_at',
    ];

    protected static function booted()
    {
        static::updating(function (Registration $registration)
        {
            if($registration->isDirty('is_approved')) {
                if ($registration->is_approved) {
                    $user = User::firstOrCreate(
                        ['email' => $registration->email],
                        [
                            'name' =>$registration->name, 
                            'password' =>$registration->password
                        ]
                    );

                    $registration->user_id = $user->id;
                }
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function registration(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

}
