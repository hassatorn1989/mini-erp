<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:255', 'unique:warehouses,code' . ($this->warehouse ? ',' . $this->warehouse->id : '')],
            'name' => ['required', 'string', 'max:255', 'unique:warehouses,name' . ($this->warehouse ? ',' . $this->warehouse->id : '')],
            'type' => ['required', 'in:main,third_party'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => trans('validation.required', ['attribute' => trans('warehouses.fields.code')]),
            'code.string' => trans('validation.string', ['attribute' => trans('warehouses.fields.code')]),
            'code.max' => trans('validation.max.string', ['attribute' => trans('warehouses.fields.code'), 'max' => 255]),
            'name.required' => trans('validation.required', ['attribute' => trans('warehouses.fields.name')]),
            'name.string' => trans('validation.string', ['attribute' => trans('warehouses.fields.name')]),
            'name.max' => trans('validation.max.string', ['attribute' => trans('warehouses.fields.name'), 'max' => 255]),
            'type.required' => trans('validation.required', ['attribute' => trans('warehouses.fields.type')]),
            'type.in' => trans('validation.in', ['attribute' => trans('warehouses.fields.type')]),
            'is_active.boolean' => trans('validation.boolean', ['attribute' => trans('warehouses.fields.is_active')]),
        ];
    }
}
