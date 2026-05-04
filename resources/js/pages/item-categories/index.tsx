import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
// eslint-disable-next-line import/order
import { index } from '@/actions/App/Http/Controllers/ItemCategoryController';
import Heading from '@/components/heading';
import AppConfirm from '@/components/system/app-confirm';
import { AppDataTable } from '@/components/system/app-datatable';
import { AppDialog } from '@/components/system/app-dialog';
import AppFilterForm from '@/components/system/app-filter-form';
import AppInput from '@/components/system/app-input';
import AppMainStat from '@/components/system/app-main-stat';
import AppSelect from '@/components/system/app-select';
import AppSwitch from '@/components/system/app-switch';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { defaultFilters } from '@/constants/app';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { Filters } from '@/types/default';
import { emptyItemCategoryForm } from '../../types/app/item-category-type';
import type {
    ItemCategoryFormState,
    ItemCategoryPaginate,
    ParentCategoryOption,
} from '../../types/app/item-category-type';
import { useItemCategoryActions } from './use-item-category-action';

export default function ItemCategoryIndex({
    items,
    parentCategories,
    filters,
}: {
    items: ItemCategoryPaginate;
    parentCategories: ParentCategoryOption[];
    filters: Filters;
}) {
    const { t } = useTranslations();
    const form = useForm<ItemCategoryFormState>(emptyItemCategoryForm);
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
    } = useItemCategoryActions({
        t,
        form,
        filterValues,
        setFilterValues,
        defaultFilters,
        emptyItemCategoryForm,
    });

    return (
        <>
            <Head title={t('item_categories.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title={t('item_categories.title')}
                        description={t('item_categories.description')}
                    />

                    <Button onClick={handleCreate} className="w-full sm:w-fit">
                        <Plus />
                        {t('item_categories.new')}
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
                    emptyDescription={t('item_categories.no_results')}
                    emptyTitle={t('item_categories.no_data')}
                />

            </div>

            <AppDialog
                open={openForm}
                onOpenChange={setOpenForm}
                title={
                    isEditing
                        ? t('item_categories.edit')
                        : t('item_categories.create')
                }
                description={t('item_categories.dialog_description')}
                submitLabel={
                    isEditing
                        ? t('ui.save_changes')
                        : t('item_categories.create')
                }
                processing={processing}
                onSubmit={handleSubmit}
            >
                <FieldGroup>
                    <AppInput
                        type="text"
                        label={t('item_categories.code')}
                        value={form.data.code}
                        onChange={(value) => form.setData('code', value)}
                        error={errors.code}
                        placeholder={t('item_categories.placeholder_code')}
                        isRequired={true}
                    />

                    <AppInput
                        type="text"
                        label={t('item_categories.name')}
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                        error={errors.name}
                        placeholder={t('item_categories.placeholder_name')}
                        isRequired={true}
                    />
                    <AppSelect
                        label={t('item_categories.parent_category')}
                        value={form.data.parent_id || ''}
                        onChange={(value) =>
                            form.setData(
                                'parent_id',
                                value === 'none' ? null : value,
                            )
                        }
                        error={errors.parent_id}
                        placeholder={t('item_categories.no_parent')}
                        options={[
                            {
                                value: 'none',
                                label: t('item_categories.no_parent'),
                            },
                            ...parentCategories
                                .filter(
                                    (option) =>
                                        !form.data.id ||
                                        option.id !== form.data.id,
                                )
                                .map((item) => ({
                                    value: item.id.toString(),
                                    label: `${item.name} (${item.code})`,
                                })),
                        ]}
                    />
                    <AppSwitch
                        label={t('ui.active')}
                        description={t('item_categories.active_hint')}
                        checked={form.data.is_active}
                        onCheckedChange={(checked) =>
                            form.setData('is_active', checked)
                        }
                    />
                </FieldGroup>
            </AppDialog>

            <AppConfirm
                icon={<Trash2 />}
                title={t('item_categories.delete_title')}
                description={t('item_categories.delete_confirmation', {
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

ItemCategoryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Item Categories',
            href: index(),
        },
    ],
};
