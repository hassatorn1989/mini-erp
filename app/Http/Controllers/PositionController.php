<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePositionRequest;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 15, 25, 50])],
        ]);

        $perPage = (int) ($filters['per_page'] ?? 10);

        $positions = Position::query()
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('positions/index', [
            'items' => $positions,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('positions.index');
    }

    public function store(StorePositionRequest $request): RedirectResponse
    {
        Position::query()->create($request->validated());

        return redirect()
            ->route('positions.index')
            ->with('success', trans('messages.created'));
    }

    public function show(Position $position): RedirectResponse
    {
        return redirect()->route('positions.index');
    }

    public function edit(Position $position): RedirectResponse
    {
        return redirect()->route('positions.index');
    }

    public function update(UpdatePositionRequest $request, Position $position): RedirectResponse
    {
        $position->update($request->validated());

        return redirect()
            ->route('positions.index')
            ->with('success', trans('messages.updated'));
    }

    public function destroy(Position $position): RedirectResponse
    {
        $position->delete();

        return redirect()
            ->route('positions.index')
            ->with('success', trans('messages.deleted'));
    }
}
