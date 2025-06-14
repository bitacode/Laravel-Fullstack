<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'started_at' => 'required|date',
            'office_space_id' => 'required|integer',
            'total_amount' => 'required|integer'
        ];
    }

    public function messages(): array
    {
        return [
            'started_at.after_or_equal' => 'The start date must be today or in the future.',
            'office_space_id.exists' => 'The selected office space is invalid.',
        ];
    }
}
