<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
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
            'unique_code' => $this->unique_code,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'min_eligible_price' => $this->min_eligible_price,
            'valid_from' => $this->valid_from,
            'valid_until' => $this->valid_until
        ];
    }
}