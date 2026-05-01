<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemCategory extends BaseModel
{
    /** @use HasFactory<ItemCategoryFactory> */
    use HasFactory, SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'created_at' => 'datetime:Y-m-d H:i:s',
            'updated_at' => 'datetime:Y-m-d H:i:s',
            'deleted_at' => 'datetime:Y-m-d H:i:s',
        ];
    }

    public function scopeIsActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeParentCategories(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(ItemCategory::class, 'parent_id');
    }

    public function childrens()
    {
        return $this->hasMany(ItemCategory::class, 'parent_id');
    }
}
