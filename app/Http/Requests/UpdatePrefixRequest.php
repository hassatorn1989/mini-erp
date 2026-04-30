<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePrefixRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:prefixes,name' . ($this->prefix ? ',' . $this->prefix->id : '')],
            'description' => ['nullable', 'string', 'max:255'],
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
            'name.required' => trans('validation.required', ['attribute' => trans('prefixes.fields.name')]),
            'name.string' => trans('validation.string', ['attribute' => trans('prefixes.fields.name')]),
            'name.max' => trans('validation.max.string', ['attribute' => trans('prefixes.fields.name'), 'max' => 255]),
            'description.max' => trans('validation.max.string', ['attribute' => trans('prefixes.fields.description'), 'max' => 255]),
            'is_active.boolean' => trans('validation.boolean', ['attribute' => trans('prefixes.fields.is_active')]),
        ];
    }
}
