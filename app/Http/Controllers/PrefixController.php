<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrefixRequest;
use App\Http\Requests\UpdatePrefixRequest;
use App\Models\Prefix;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PrefixController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 15, 25, 50])],
        ]);

        $perPage = (int) ($filters['per_page'] ?? 10);

        $prefixes = Prefix::query()
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn($query) => $query->where('is_active', false))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('prefixes/index', [
            'items' => $prefixes,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('prefixes.index');
    }

    public function store(StorePrefixRequest $request): RedirectResponse
    {
        Prefix::query()->create($request->validated());

        return redirect()
            ->route('prefixes.index')
            ->with('success', trans('messages.created'));
    }

    public function show(Prefix $prefix): RedirectResponse
    {
        return redirect()->route('prefixes.index');
    }

    public function edit(Prefix $prefix): RedirectResponse
    {
        return redirect()->route('prefixes.index');
    }

    public function update(UpdatePrefixRequest $request, Prefix $prefix): RedirectResponse
    {
        $prefix->update($request->validated() + ['is_active' => $request->has('is_active')]);

        return redirect()
            ->route('prefixes.index')
            ->with('success', trans('messages.updated'));
    }

    public function destroy(Prefix $prefix): RedirectResponse
    {
        $prefix->delete();

        return redirect()
            ->route('prefixes.index')
            ->with('success', trans('messages.deleted'));
    }
}
