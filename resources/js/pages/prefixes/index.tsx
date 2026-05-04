import { Head } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { index } from '@/actions/App/Http/Controllers/PrefixController';
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
import { usePrefixActions } from '../../hooks/app/use-prefix-action';
import { emptyPrefixForm } from '../../types/app/prefix-type';
import type { PrefixPaginate } from '../../types/app/prefix-type';

export default function PrefixIndex({
    items,
    filters,
}: {
    items: PrefixPaginate;
    filters: Filters;
}) {
    const { t } = useTranslations();

    const [filterValues, setFilterValues] = useState<Filters>({
        ...defaultFilters,
        ...filters,
    });

    const activeCount = items.data.filter((item) => item.is_active).length;
    const inactiveCount = items.data.length - activeCount;

    const hasFilters =
        !!filters.search || !!filters.status || filters.per_page !== 10;

    const {
        columns,
        openForm,
        setOpenForm,
        isProcessing,
        openDelete,
        setOpenDelete,
        confirmDelete,
        selectedItem,

        errors,
        register,
        handleSubmit,
        control,

        submitFilters,
        resetFilters,
        handleCreate,

        isEditMode,
    } = usePrefixActions({
        t,
        filterValues,
        setFilterValues,
        defaultFilters,
        emptyPrefixForm,
    });

    return (
        <>
            <Head title={t('prefixes.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title={t('prefixes.title')}
                        description={t('prefixes.description')}
                    />

                    <Button onClick={handleCreate} className="w-full sm:w-fit">
                        <Plus />
                        {t('prefixes.new')}
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
                    emptyDescription={t('prefixes.no_results')}
                    emptyTitle={t('prefixes.no_data')}
                />
            </div>

            <AppDialog
                openDialogState={{
                    open: openForm,
                    onOpenChange: setOpenForm,
                }}
                title={isEditMode ? t('prefixes.edit') : t('prefixes.create')}
                description={t('prefixes.dialog_description')}
                submitLabel={
                    isEditMode ? t('ui.save_changes') : t('prefixes.create')
                }
                disable={isProcessing}
                onSubmit={handleSubmit}
            >
                <FieldGroup>
                    <AppInput
                        label="ชื่อคำนำหน้า"
                        registration={register('name', {
                            required: 'กรุณากรอกชื่อคำนำหน้า',
                        })}
                        error={errors.name}
                        required
                        disabled={isProcessing}
                    />

                    <AppSwitch
                        label={t('ui.active')}
                        disabled={isProcessing}
                        control={control}
                        controlName="is_active"
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
                disable={isProcessing}
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

PrefixIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Prefixes',
            href: index(),
        },
    ],
};
