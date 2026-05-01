<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Prefix;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 15, 25, 50])],
        ]);

        $perPage = (int) ($filters['per_page'] ?? 10);

        $employees = Employee::query()
            ->with('position:id,name')
            ->with('department:id,name')
            ->with('user:username')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('code', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $prefixOptions = Prefix::query()->active()->get(['id', 'name'])->map(fn ($prefix) => [
            'value' => $prefix->id,
            'label' => $prefix->name,
        ]);

        $departmentOptions = Employee::query()->with('department:id,name')->get()->pluck('department')->unique('id')->map(fn ($department) => [
            'value' => $department->id,
            'label' => $department->name,
        ]);


        $positionOptions = Employee::query()->with('position:id,name')->get()->pluck('position')->unique('id')->map(fn ($position) => [
            'value' => $position->id,
            'label' => $position->name,
        ]);


        return Inertia::render('employees/index', [
            'items' => $employees,
            'prefixOptions' => $prefixOptions,
            'departmentOptions' => $departmentOptions,
            'positionOptions' => $positionOptions,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): RedirectResponse
    {
        return redirect()->route('employees.index');
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $employeeData = Arr::except($request->validated(), ['user']);
        $userData = Arr::only($request->validated(), ['user']);
        $userData['password'] = bcrypt($userData['password']);

        $employee = Employee::query()->create($employeeData);
        $employee->user()->create($userData);

        return redirect()
            ->route('employees.index')
            ->with('success', trans('messages.created'));
    }

    public function show(Employee $employee): RedirectResponse
    {
        return redirect()->route('employees.index');
    }

    public function edit(Employee $employee): RedirectResponse
    {
        return redirect()->route('employees.index');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $EmployeeData = Arr::except($request->validated(), ['user']);
        $userData = Arr::only($request->validated(), ['user']);

        if (isset($userData['password'])) {
            $userData['password'] = bcrypt($userData['password']);
        } else {
            unset($userData['password']);
        }

        $employee->update($EmployeeData);
        $employee->user()->update($userData);

        return redirect()
            ->route('employees.index')
            ->with('success', trans('messages.updated'));
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->user()->delete();
        $employee->delete();

        return redirect()
            ->route('employees.index')
            ->with('success', trans('messages.deleted'));
    }
}
