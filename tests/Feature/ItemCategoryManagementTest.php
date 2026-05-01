<?php

use App\Models\ItemCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('item category can be updated without changing its existing code', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $parentCategory = ItemCategory::query()->create([
        'code' => 'RAW',
        'name' => 'Raw Materials',
        'is_active' => true,
    ]);

    $itemCategory = ItemCategory::query()->create([
        'code' => 'FG',
        'name' => 'Finished Goods',
        'is_active' => true,
    ]);

    $this->put(route('item-categories.update', $itemCategory), [
        'code' => 'FG',
        'name' => 'Finished Goods Updated',
        'parent_id' => $parentCategory->id,
        'is_active' => false,
    ])
        ->assertRedirect(route('item-categories.index'));

    expect($itemCategory->refresh())
        ->name->toBe('Finished Goods Updated')
        ->code->toBe('FG')
        ->parent_id->toBe($parentCategory->id)
        ->is_active->toBeFalse();
});
