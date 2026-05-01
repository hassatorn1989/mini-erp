<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ItemCategoryController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PrefixController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::post('locale/{locale}', [LocaleController::class, 'update'])->name('locale.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('prefixes', PrefixController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('positions', PositionController::class);
    Route::resource('warehouses', WarehouseController::class);
    Route::resource('item-categories', ItemCategoryController::class);
});

require __DIR__.'/settings.php';
