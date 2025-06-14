<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeSpaceResource extends JsonResource
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
            'thumbnail' => $this->thumbnail,
            'price' => $this->price,
            'duration' => $this->duration,
            'address' => $this->address,
            'is_open' => $this->is_open,
            'is_full_booked' => $this->is_full_booked,
            'about' => $this->about,
            'slug' => $this->slug,
            'city' => new CityResource($this->whenLoaded('city')),
            'user' => new UserResouce($this->whenLoaded('user')),
            'registration' => new RegistrationResource($this->whenLoaded('registration')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'photos' => OfficeSpacePhotoResource::collection($this->whenLoaded('photos')),
            'benefits' => OfficeSpaceBenefitResource::collection($this->whenLoaded('benefits')),
            'contacts' => OfficeContactResource::collection($this->whenLoaded('contacts')),
        ];
    }
}
