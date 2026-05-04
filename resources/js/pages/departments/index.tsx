import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { index } from '@/actions/App/Http/Controllers/DepartmentController';
import Heading from '@/components/heading';
import AppConfirm from '@/components/system/app-confirm';
import { AppDataTable } from '@/components/system/app-datatable';
import { AppDialog } from '@/components/system/app-dialog';
import AppFilterForm from '@/components/system/app-filter-form';
import AppInput from '@/components/system/app-input';
import AppMainStat from '@/components/system/app-main-stat';
import AppSwitch from '@/components/system/app-switch';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { defaultFilters } from '@/constants/app';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { Filters } from '@/types/default';
import { emptyDepartmentForm } from '../../types/app/department-type';
import type {
    DepartmentFormState,
    DepartmentPaginate,
} from '../../types/app/department-type';
import { useDepartmentActions } from './use-department-action';

export default function DepartmentIndex({
    items,
    filters,
}: {
    items: DepartmentPaginate;
    filters: Filters;
}) {
    const { t } = useTranslations();
    const form = useForm<DepartmentFormState>(emptyDepartmentForm);
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
    } = useDepartmentActions({
        t,
        form,
        filterValues,
        setFilterValues,
        defaultFilters,
        emptyDepartmentForm,
    });

    return (
        <>
            <Head title={t('departments.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title={t('departments.title')}
                        description={t('departments.description')}
                    />

                    <Button onClick={handleCreate} className="w-full sm:w-fit">
                        <Plus />
                        {t('departments.new')}
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
                    emptyDescription={t('departments.no_results')}
                    emptyTitle={t('departments.no_data')}
                />
            </div>

            <AppDialog
                open={openForm}
                onOpenChange={setOpenForm}
                title={
                    isEditing ? t('departments.edit') : t('departments.create')
                }
                description={t('departments.dialog_description')}
                submitLabel={
                    isEditing ? t('ui.save_changes') : t('departments.create')
                }
                processing={processing}
                onSubmit={handleSubmit}
            >
                <FieldGroup>
                    <AppInput
                        type="text"
                        label={t('departments.code')}
                        value={form.data.code}
                        onChange={(value) => form.setData('code', value)}
                        error={errors.code}
                        placeholder={t('departments.placeholder_code')}
                        isRequired
                    />
                    <AppInput
                        type="text"
                        label={t('departments.name')}
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                        error={errors.name}
                        placeholder={t('departments.placeholder_name')}
                        isRequired
                    />
                    <AppSwitch
                        label={t('ui.active')}
                        description={t('departments.available_hint')}
                        checked={form.data.is_active}
                        onCheckedChange={(checked) =>
                            form.setData('is_active', checked)
                        }
                    />
                </FieldGroup>
            </AppDialog>

            <AppConfirm
                icon={<Trash2 />}
                title={t('departments.delete_title')}
                description={t('departments.delete_confirmation', {
                    name: selectedItem?.name ?? '',
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

DepartmentIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Departments',
            href: index(),
        },
    ],
};
