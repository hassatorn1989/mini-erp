<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
            'prefix_id' => ['required', 'exists:prefixes,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'code' => ['required', 'string', 'max:255', 'unique:employees,code'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'hire_date' => ['required', 'date'],
            'termination_date' => ['nullable', 'date', 'after_or_equal:hire_date'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
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
            'prefix_id.required' => trans('validation.required', ['attribute' => trans('employees.fields.prefix')]),
            'prefix_id.exists' => trans('validation.exists', ['attribute' => trans('employees.fields.prefix')]),
            'department_id.required' => trans('validation.required', ['attribute' => trans('employees.fields.department')]),
            'department_id.exists' => trans('validation.exists', ['attribute' => trans('employees.fields.department')]),
            'position_id.required' => trans('validation.required', ['attribute' => trans('employees.fields.position')]),
            'position_id.exists' => trans('validation.exists', ['attribute' => trans('employees.fields.position')]),
            'code.required' => trans('validation.required', ['attribute' => trans('employees.fields.code')]),
            'code.string' => trans('validation.string', ['attribute' => trans('employees.fields.code')]),
            'code.max' => trans('validation.max.string', ['attribute' => trans('employees.fields.code'), 'max' => 255]),
            'first_name.required' => trans('validation.required', ['attribute' => trans('employees.fields.first_name')]),
            'first_name.string' => trans('validation.string', ['attribute' => trans('employees.fields.first_name')]),
            'first_name.max' => trans('validation.max.string', ['attribute' => trans('employees.fields.first_name'), 'max' => 255]),
            'last_name.required' => trans('validation.required', ['attribute' => trans('employees.fields.last_name')]),
            'last_name.string' => trans('validation.string', ['attribute' => trans('employees.fields.last_name')]),
            'last_name.max' => trans('validation.max.string', ['attribute' => trans('employees.fields.last_name'), 'max' => 255]),
            'email.email' => trans('validation.email', ['attribute' => trans('employees.fields.email')]),
            'email.max' => trans('validation.max.string', ['attribute' => trans('employees.fields.email'), 'max' => 255]),
            'phone.string' => trans('validation.string', ['attribute' => trans('employees.fields.phone')]),
            'phone.max' => trans('validation.max.string', ['attribute' => trans('employees.fields.phone'), 'max' => 20]),
            'hire_date.required' => trans('validation.required', ['attribute' => trans('employees.fields.hire_date')]),
            'hire_date.date' => trans('validation.date', ['attribute' => trans('employees.fields.hire_date')]),
            'termination_date.date' => trans('validation.date', ['attribute' => trans('employees.fields.termination_date')]),
            'termination_date.after_or_equal' => trans('validation.after_or_equal', ['attribute' => trans('employees.fields.termination_date'), 'date' => trans('employees.fields.hire_date')]),
            'is_active.required' => trans('validation.required', ['attribute' => trans('employees.fields.is_active')]),
            'is_active.boolean' => trans('validation.boolean', ['attribute' => trans('employees.fields.is_active')]),
        ];
    }
}
