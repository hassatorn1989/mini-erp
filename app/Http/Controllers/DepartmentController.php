<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 15, 25, 50])],
        ]);

        $perPage = (int) ($filters['per_page'] ?? 10);

        $departments = Department::query()
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

        return Inertia::render('departments/index', [
            'items' => $departments,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('departments.index');
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::query()->create($request->validated());

        return redirect()
            ->route('departments.index')
            ->with('success', trans('messages.created'));
    }

    public function show(Department $department): RedirectResponse
    {
        return redirect()->route('departments.index');
    }

    public function edit(Department $department): RedirectResponse
    {
        return redirect()->route('departments.index');
    }

    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $department->update($request->validated());

        return redirect()
            ->route('departments.index')
            ->with('success', trans('messages.updated'));
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();

        return redirect()
            ->route('departments.index')
            ->with('success', trans('messages.deleted'));
    }
}
