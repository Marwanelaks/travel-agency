<?php

namespace App\Http\Requests\API;

use App\Models\RoomType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomTypeRequest extends FormRequest
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
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $roomType = $this->route('room_type');
        
        return [
            'name' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('room_types', 'name')->ignore($roomType->id ?? null),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:120',
                Rule::unique('room_types', 'slug')->ignore($roomType->id ?? null),
            ],
            'description' => 'nullable|string',
            'base_occupancy' => 'sometimes|integer|min:1',
            'max_occupancy' => 'sometimes|integer|min:1|gte:base_occupancy',
            'max_extra_beds' => 'sometimes|integer|min:0',
            'extra_bed_charge' => 'sometimes|numeric|min:0',
            'base_price' => 'sometimes|numeric|min:0',
            'amenities' => 'sometimes|array',
            'amenities.*' => 'exists:room_amenities,id',
        ];
    }
}
