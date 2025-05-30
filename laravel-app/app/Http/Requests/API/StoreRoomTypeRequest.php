<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomTypeRequest extends FormRequest
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
            'name' => 'required|string|max:100|unique:room_types,name',
            'slug' => 'nullable|string|max:120|unique:room_types,slug',
            'description' => 'nullable|string',
            'base_occupancy' => 'required|integer|min:1',
            'max_occupancy' => 'required|integer|min:1|gte:base_occupancy',
            'max_extra_beds' => 'required|integer|min:0',
            'extra_bed_charge' => 'required|numeric|min:0',
            'base_price' => 'required|numeric|min:0',
            'amenities' => 'sometimes|array',
            'amenities.*' => 'exists:room_amenities,id',
        ];
    }
}
