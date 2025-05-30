<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
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
            'hotel_id' => 'required|exists:hotels,id',
            'room_type_id' => 'required|exists:room_types,id',
            'room_number' => 'required|string|max:20|unique:rooms,room_number',
            'price_per_night' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'available_quantity' => 'required|integer|min:0',
            'status' => 'required|in:available,booked,maintenance',
            'amenities' => 'sometimes|array',
            'amenities.*' => 'exists:room_amenities,id',
        ];
    }
}
