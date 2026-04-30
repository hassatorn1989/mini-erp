<?php

use App\Models\Prefix;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated users can view prefixes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('prefixes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'th')
            ->where('translations.prefixes.title', 'คำนำหน้า')
            ->where('translations.ui.active', 'ใช้งาน')
        );
});

test('prefix active status can be disabled when updating', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $prefix = Prefix::query()->create([
        'name' => 'Mr.',
        'is_active' => true,
    ]);

    $this->put(route('prefixes.update', $prefix), [
        'name' => 'Mister',
        'is_active' => false,
    ])
        ->assertRedirect(route('prefixes.index'));

    expect($prefix->refresh()->is_active)->toBeFalse();
});

test('users can switch between thai and english locales', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('locale.update', 'en'))
        ->assertRedirect();

    $this->actingAs($user)
        ->get(route('prefixes.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'en')
            ->where('translations.prefixes.title', 'Prefixes')
            ->where('translations.ui.active', 'Active')
        );
});
