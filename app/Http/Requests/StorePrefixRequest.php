<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePrefixRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:prefixes,name'],
            'description' => ['nullable', 'string', 'max:255'],
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
            'name.required' => trans('validation.required', ['attribute' => trans('prefixes.name')]),
            'name.string' => trans('validation.string', ['attribute' => trans('prefixes.name')]),
            'name.max' => trans('validation.max.string', ['attribute' => trans('prefixes.name'), 'max' => 255]),
            'description.max' => trans('validation.max.string', ['attribute' => trans('prefixes.description'), 'max' => 255]),
            'is_active.required' => trans('validation.required', ['attribute' => trans('prefixes.is_active')]),
            'is_active.boolean' => trans('validation.boolean', ['attribute' => trans('prefixes.is_active')]),
        ];
    }
}
