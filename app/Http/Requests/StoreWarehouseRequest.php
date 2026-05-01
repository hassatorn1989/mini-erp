<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:255', 'unique:warehouses,code'],
            'name' => ['required', 'string', 'max:255', 'unique:warehouses,name'],
            'is_active' => ['required', 'boolean'],
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
            'is_active.required' => trans('validation.required', ['attribute' => trans('warehouses.fields.is_active')]),
            'is_active.boolean' => trans('validation.boolean', ['attribute' => trans('warehouses.fields.is_active')]),
        ];
    }
}
