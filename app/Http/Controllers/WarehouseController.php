<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 15, 25, 50])],
        ]);

        $perPage = (int) ($filters['per_page'] ?? 10);

        $warehouses = Warehouse::query()
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('warehouses/index', [
            'items' => $warehouses,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('warehouses.index');
    }

    public function store(StoreWarehouseRequest $request): RedirectResponse
    {
        Warehouse::query()->create($request->validated());

        return redirect()
            ->route('warehouses.index')
            ->with('success', trans('messages.created'));
    }

    public function show(Warehouse $warehouse): RedirectResponse
    {
        return redirect()->route('warehouses.index');
    }

    public function edit(Warehouse $warehouse): RedirectResponse
    {
        return redirect()->route('warehouses.index');
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse): RedirectResponse
    {
        $warehouse->update($request->validated());

        return redirect()
            ->route('warehouses.index')
            ->with('success', trans('messages.updated'));
    }

    public function destroy(Warehouse $warehouse): RedirectResponse
    {
        $warehouse->delete(1);

        return redirect()
            ->route('warehouses.index')
            ->with('success', trans('messages.deleted'));
    }
}
