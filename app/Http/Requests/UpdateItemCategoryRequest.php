<?php

namespace App\Http\Requests;

use App\Models\ItemCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItemCategoryRequest extends FormRequest
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
        /** @var ItemCategory|string|null $itemCategory */
        $itemCategoryId = is_string($this->route('item_category')) ? null : $this->route('item_category')->id;

        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('item_categories', 'code')->ignore($itemCategoryId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'exists:item_categories,id',
                Rule::notIn(array_filter([$itemCategoryId])),
            ],
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
            'code.required' => trans('validation.required', ['attribute' => trans('item_categories.fields.code')]),
            'code.string' => trans('validation.string', ['attribute' => trans('item_categories.fields.code')]),
            'code.max' => trans('validation.max.string', ['attribute' => trans('item_categories.fields.code'), 'max' => 255]),
            'name.required' => trans('validation.required', ['attribute' => trans('item_categories.fields.name')]),
            'name.string' => trans('validation.string', ['attribute' => trans('item_categories.fields.name')]),
            'name.max' => trans('validation.max.string', ['attribute' => trans('item_categories.fields.name'), 'max' => 255]),
            'parent_id.exists' => trans('validation.exists', ['attribute' => trans('item_categories.fields.parent_id')]),
            'is_active.boolean' => trans('validation.boolean', ['attribute' => trans('item_categories.fields.is_active')]),
        ];
    }
}
