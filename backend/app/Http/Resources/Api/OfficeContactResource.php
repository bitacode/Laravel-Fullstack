<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeContactResource extends JsonResource
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
            'role' => $this->role,
            'photo' => $this->photo,
            'telephone_number' => $this->telephone_number,
            'whatsapp_number' => $this->whatsapp_number,
        ];
    }
}
