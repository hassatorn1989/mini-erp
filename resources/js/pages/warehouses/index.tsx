import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { index } from '@/actions/App/Http/Controllers/WarehouseController';
import Heading from '@/components/heading';
import AppConfirm from '@/components/system/app-confirm';
import { AppDataTable } from '@/components/system/app-datatable';
import { AppDialog } from '@/components/system/app-dialog';
import AppFilterForm from '@/components/system/app-filter-form';
import AppInput from '@/components/system/app-input';
import AppMainStat from '@/components/system/app-main-stat';
import { AppPagination } from '@/components/system/app-pagination';
import AppSelect from '@/components/system/app-select';
import AppSwitch from '@/components/system/app-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { defaultFilters } from '@/constants/app';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { Filters } from '@/types/default';
import { emptyWarehouseForm } from '../../types/app/warehouse-type';
import type {
    WarehousePaginate,
    WarehouseFormState,
} from '../../types/app/warehouse-type';
import { useWarehouseActions } from './use-warehouse-action';

const optionTypes = [
    {
        value: 'main',
        label: 'Main Warehouse',
    },
    {
        value: 'third_party',
        label: 'Third Party Warehouse',
    },
];

export default function WarehouseIndex({
    items,
    filters,
}: {
    items: WarehousePaginate;
    filters: Filters;
}) {
    const { t } = useTranslations();
    const form = useForm<WarehouseFormState>(emptyWarehouseForm);
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
    } = useWarehouseActions({
        t,
        form,
        filterValues,
        setFilterValues,
        defaultFilters,
        emptyWarehouseForm,
    });

    return (
        <>
            <Head title={t('warehouses.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title={t('warehouses.title')}
                        description={t('warehouses.description')}
                    />

                    <Button onClick={handleCreate} className="w-full sm:w-fit">
                        <Plus />
                        {t('warehouses.new')}
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

                <Card className="gap-0 py-0">
                    <CardHeader className="border-b py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>{t('warehouses.title')}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {t('warehouses.showing', {
                                        from: items.from ?? 0,
                                        to: items.to ?? 0,
                                        total: items.total,
                                    })}
                                </p>
                            </div>

                            {hasFilters && (
                                <Badge variant="outline">
                                    {t('ui.filtered_results')}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <AppDataTable
                            columns={columns}
                            data={items.data}
                            emptyDescription={t('warehouses.empty_description')}
                            emptyTitle={t('warehouses.empty_title')}
                        />
                    </CardContent>
                </Card>

                <AppPagination links={items.links} />
            </div>

            <AppDialog
                open={openForm}
                onOpenChange={setOpenForm}
                title={
                    isEditing ? t('warehouses.edit') : t('warehouses.create')
                }
                description={t('warehouses.dialog_description')}
                submitLabel={
                    isEditing ? t('ui.save_changes') : t('warehouses.create')
                }
                processing={processing}
                onSubmit={handleSubmit}
            >
                <FieldGroup>
                    <AppInput
                        type="text"
                        label={t('warehouses.code')}
                        value={form.data.code}
                        onChange={(value) => form.setData('code', value)}
                        error={errors.code}
                        placeholder={t('warehouses.placeholder_code')}
                        isRequired
                    />
                    <AppInput
                        type="text"
                        label={t('warehouses.name')}
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                        error={errors.name}
                        placeholder={t('warehouses.placeholder_name')}
                        isRequired
                    />

                    <AppSelect
                        label={t('warehouses.type')}
                        value={form.data.type}
                        onChange={(value) =>
                            form.setData(
                                'type',
                                value as WarehouseFormState['type'],
                            )
                        }
                        options={optionTypes}
                        placeholder={t('warehouses.placeholder_type')}
                    />

                    <AppSwitch
                        label={t('ui.active')}
                        checked={form.data.is_active}
                        onCheckedChange={(checked) =>
                            form.setData('is_active', checked)
                        }
                    />
                </FieldGroup>
            </AppDialog>

            <AppConfirm
                icon={<Trash2 />}
                title={t('warehouses.delete_title')}
                description={t('warehouses.delete_confirmation', {
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

WarehouseIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Warehouses',
            href: index(),
        },
    ],
};
