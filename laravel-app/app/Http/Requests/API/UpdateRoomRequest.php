<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
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
            'hotel_id' => 'sometimes|exists:hotels,id',
            'room_type_id' => 'sometimes|exists:room_types,id',
            'room_number' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('rooms', 'room_number')->ignore($this->room),
            ],
            'price_per_night' => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|integer|min:1',
            'available_quantity' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:available,booked,maintenance',
            'amenities' => 'sometimes|array',
            'amenities.*' => 'exists:room_amenities,id',
        ];
    }
}
