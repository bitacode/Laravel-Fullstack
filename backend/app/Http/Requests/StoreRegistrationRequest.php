<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrationRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:registrations,name',
            'email' => 'required|string|max:255|unique:registrations,email',
            'bank_name_primary' => 'required|in:BRI,BCA,Mandiri,BNI',
            'bank_account_primary' => 'required|string|max:255|regex:/^\d+$/',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'This company name is already registered',
            'email.unique' => 'This email is already registered',
        ];
    }

}
