<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
    // boot
    protected static function boot(): void
    {
        parent::boot();

        // Automatically set created_by, updated_by, and deleted_by fields
        static::creating(function ($model) {
            if (auth()->check()) {
                $model->created_by = auth()->id();
                $model->updated_by = auth()->id();
            } else {
                $model->created_by = 'system';
                $model->updated_by = 'system';
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            } else {
                $model->updated_by = 'system';
            }
        });
    }
}
