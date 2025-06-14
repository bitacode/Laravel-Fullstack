<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Hash;

class RegistrationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'bank_name_primary' => $this->bank_name_primary,
            'bank_name_secondary' => $this->bank_name_secondary,
            'bank_account_primary' => $this->bank_account_primary,
            'bank_account_secondary' => $this->bank_account_secondary,
            'is_approved' => $this->is_approved
        ];
    }
}
