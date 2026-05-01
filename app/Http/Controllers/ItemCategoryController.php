<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemCategoryRequest;
use App\Http\Requests\UpdateItemCategoryRequest;
use App\Models\ItemCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ItemCategoryController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 15, 25, 50])],
        ]);

        $perPage = (int) ($filters['per_page'] ?? 10);

        $itemcategories = ItemCategory::query()
            ->with('parent')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn($query) => $query->where('is_active', false))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('item-categories/index', [
            'items' => $itemcategories,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('item-categories.index');
    }

    public function store(StoreItemCategoryRequest $request): RedirectResponse
    {
        ItemCategory::query()->create($request->validated());

        return redirect()
            ->route('item-categories.index')
            ->with('success', trans('messages.created'));
    }

    public function show(ItemCategory $itemcategory): RedirectResponse
    {
        return redirect()->route('item-categories.index');
    }

    public function edit(ItemCategory $itemcategory): RedirectResponse
    {
        return redirect()->route('item-categories.index');
    }

    public function update(UpdateItemCategoryRequest $request, ItemCategory $itemcategory): RedirectResponse
    {
        $itemcategory->update($request->validated());

        return redirect()
            ->route('item-categories.index')
            ->with('success', trans('messages.updated'));
    }

    public function destroy(ItemCategory $itemcategory): RedirectResponse
    {
        $itemcategory->delete();

        return redirect()
            ->route('item-categories.index')
            ->with('success', trans('messages.deleted'));
    }
}
