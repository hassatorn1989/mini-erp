import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { index } from '@/actions/App/Http/Controllers/EmployeeController';
import Heading from '@/components/heading';
import AppConfirm from '@/components/system/app-confirm';
import { AppDataTable } from '@/components/system/app-datatable';
import { AppDialog } from '@/components/system/app-dialog';
import AppFilterForm from '@/components/system/app-filter-form';
import AppInput from '@/components/system/app-input';
import AppMainStat from '@/components/system/app-main-stat';
import AppSelect from '@/components/system/app-select';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { defaultFilters } from '@/constants/app';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { defaultOptions, Filters } from '@/types/default';
import { employeeEmptyForm } from '../../types/app/employee-type';
import type {
    EmployeePaginate,
    EmployeeFormState,
} from '../../types/app/employee-type';
import { useEmployeeActions } from './use-employee-action';

export default function EmployeeIndex({
    items,
    filters,
    departmentOptions,
    positionOptions,
    prefixOptions,
}: {
    items: EmployeePaginate;
    filters: Filters;
    departmentOptions: defaultOptions[];
    positionOptions: defaultOptions[];
    prefixOptions: defaultOptions[];
}) {
    const { t } = useTranslations();
    const form = useForm<EmployeeFormState>(employeeEmptyForm);
    const [filterValues, setFilterValues] = useState<Filters>({
        ...defaultFilters,
        ...filters,
    });

    const activeCount = items.data.filter((item) => item.is_active).length;
    const inactiveCount = items.data.length - activeCount;

    const hasFilters =
        !!filters.search || !!filters.status || filters.per_page !== 10;

    const isEditing = !!form.data.id;

    const {
        columns,

        openForm,
        setOpenForm,

        openDelete,
        setOpenDelete,

        selectedItem,

        processing,
        errors,

        submitFilters,
        resetFilters,
        handleCreate,
        handleSubmit,
        confirmDelete,
    } = useEmployeeActions({
        t,
        form,
        filterValues,
        setFilterValues,
        defaultFilters,
        emptyEmployeeForm: employeeEmptyForm,
    });

    return (
        <>
            <Head title={t('employees.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title={t('employees.title')}
                        description={t('employees.description')}
                    />

                    <Button onClick={handleCreate} className="w-full sm:w-fit">
                        <Plus />
                        {t('employees.new')}
                    </Button>
                </div>

                <AppMainStat
                    total={items.total}
                    activeCount={activeCount}
                    inactiveCount={inactiveCount}
                    hasFilters={hasFilters}
                />

                <AppFilterForm
                    onChangeValues={{
                        value: filterValues,
                        setValue: setFilterValues,
                    }}
                    submitFilters={(e) => {
                        e.preventDefault();
                        submitFilters();
                    }}
                    resetFilters={resetFilters}
                />

                <AppDataTable
                    columns={columns}
                    itemData={items.data}
                    itemFrom={items.from ?? 0}
                    itemTo={items.to ?? 0}
                    itemTotal={items.total}
                    itemLinks={items.links}
                    hasFilters={hasFilters}
                    emptyDescription={t('employees.no_results')}
                    emptyTitle={t('employees.no_data')}
                />
            </div>

            <AppDialog
                open={openForm}
                onOpenChange={setOpenForm}
                title={isEditing ? t('employees.edit') : t('employees.create')}
                description={t('employees.dialog_description')}
                submitLabel={
                    isEditing ? t('ui.save_changes') : t('employees.create')
                }
                processing={processing}
                onSubmit={handleSubmit}
                className="w-full sm:max-w-[700px]"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <AppInput
                            type="text"
                            label={t('employees.code')}
                            value={form.data.code}
                            onChange={(value) => form.setData('code', value)}
                            disabled={processing}
                            error={errors.code}
                        />
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <AppSelect
                            label={t('employees.prefix')}
                            value={form.data.prefix_id || ''}
                            onChange={(value) =>
                                form.setData('prefix_id', value)
                            }
                            disabled={processing}
                            error={errors.prefix_id}
                            options={prefixOptions.map((opt) => ({
                                ...opt,
                                value: String(opt.value),
                            }))}
                            placeholder={t('ui.please_select')}
                        />
                        <AppInput
                            type="text"
                            label={t('employees.first_name')}
                            value={form.data.first_name}
                            onChange={(value) =>
                                form.setData('first_name', value)
                            }
                            disabled={processing}
                            error={errors.first_name}
                        />

                        <AppInput
                            type="text"
                            label={t('employees.last_name')}
                            value={form.data.last_name}
                            onChange={(value) =>
                                form.setData('last_name', value)
                            }
                            disabled={processing}
                            error={errors.last_name}
                        />
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <AppSelect
                            label={t('employees.department')}
                            value={form.data.department_id || ''}
                            onChange={(value) =>
                                form.setData('department_id', value)
                            }
                            disabled={processing}
                            error={errors.department_id}
                            options={departmentOptions.map((opt) => ({
                                ...opt,
                                value: String(opt.value),
                            }))}
                            placeholder={t('ui.please_select')}
                        />

                        <AppSelect
                            label={t('employees.position')}
                            value={form.data.position_id || ''}
                            onChange={(value) =>
                                form.setData('position_id', value)
                            }
                            disabled={processing}
                            error={errors.position_id}
                            options={positionOptions.map((opt) => ({
                                ...opt,
                                value: String(opt.value),
                            }))}
                            placeholder={t('ui.please_select')}
                        />
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <AppInput
                            type="email"
                            label={t('employees.email')}
                            value={form.data.email}
                            onChange={(value) => form.setData('email', value)}
                            disabled={processing}
                            error={errors.email}
                        />
                        <AppInput
                            type="text"
                            label={t('employees.phone')}
                            value={form.data.phone}
                            onChange={(value) => form.setData('phone', value)}
                            disabled={processing}
                            error={errors.phone}
                        />
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <AppInput
                            type="date"
                            label={t('employees.hire_date')}
                            value={form.data.hire_date}
                            onChange={(value) =>
                                form.setData('hire_date', value)
                            }
                            disabled={processing}
                            error={errors.hire_date}
                        />

                        <AppInput
                            type="date"
                            label={t('employees.termination_date')}
                            value={form.data.termination_date || ''}
                            onChange={(value) =>
                                form.setData('termination_date', value)
                            }
                            disabled={processing}
                            error={errors.termination_date}
                        />
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <AppInput
                            type="text"
                            label={t('employees.username')}
                            value={form.data.username}
                            onChange={(value) =>
                                form.setData('username', value)
                            }
                            disabled={processing}
                            error={errors.username}
                        />
                        <AppInput
                            type="password"
                            label={t('employees.password')}
                            value={form.data.password}
                            onChange={(value) =>
                                form.setData('password', value)
                            }
                            disabled={processing}
                            error={errors.password}
                        />
                    </FieldGroup>

                    <Field orientation="horizontal">
                        <Switch
                            id="prefix-is-active"
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked)
                            }
                        />
                        <FieldContent>
                            <FieldLabel htmlFor="prefix-is-active">
                                {t('ui.active')}
                            </FieldLabel>
                            <FieldDescription>
                                {t('employees.active_hint')}
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                </form>
            </AppDialog>

            <AppConfirm
                icon={<Trash2 />}
                title={t('employees.delete_title')}
                description={t('employees.delete_confirmation', {
                    name: selectedItem
                        ? `${selectedItem.first_name} ${selectedItem.last_name}`
                        : '',
                })}
                openDialog={{ open: openDelete, setOpen: setOpenDelete }}
                disable={processing}
                onClick={confirmDelete}
                buttonLabel={
                    <>
                        <Trash2 />
                        {t('ui.delete')}
                    </>
                }
            />
        </>
    );
}

EmployeeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Employees',
            href: index(),
        },
    ],
};
