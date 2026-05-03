import { Head, router, useForm } from '@inertiajs/react';
import { Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
// eslint-disable-next-line import/order
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/ItemCategoryController';
import Heading from '@/components/heading';
import { AppDataTable } from '@/components/system/app-datatable';
import { AppDialog } from '@/components/system/app-dialog';
import AppInput from '@/components/system/app-input';
import { AppPagination } from '@/components/system/app-pagination';
import AppSelect from '@/components/system/app-select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { Filters } from '@/types/default';
import { defaultFilters } from '@/types/default';
import { getColumns } from './column';
import {
    emptyItemCategoryForm
} from './type';
import type {ItemCategoryFormState, ItemCategoryItem, ItemCategoryPaginate, ParentCategoryOption} from './type';
import AppSwitch from '@/components/system/app-switch';
import AppConfirm from '@/components/system/app-confirm';

export default function ItemCategoryIndex({
    items,
    parentCategories,
    filters,
}: {
    items: ItemCategoryPaginate;
    parentCategories: ParentCategoryOption[];
    filters: Filters;
}) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemCategoryItem | null>(
        null,
    );
    const [filterValues, setFilterValues] = useState<Filters>({
        ...defaultFilters,
        ...filters,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { t } = useTranslations();

    const form = useForm<ItemCategoryFormState>(emptyItemCategoryForm);

    const activeCount = items.data.filter((item) => item.is_active).length;
    const inactiveCount = items.data.length - activeCount;
    const hasFilters =
        !!filters.search || !!filters.status || filters.per_page !== 10;
    const isEditing = !!form.data.id;

    const submitFilters = (nextFilters: Filters = filterValues) => {
        router.get(
            index.url({
                query: {
                    search: nextFilters.search || undefined,
                    status: nextFilters.status || undefined,
                    per_page: nextFilters.per_page,
                },
            }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetFilters = () => {
        setFilterValues(defaultFilters);

        router.get(index.url(), {}, { preserveScroll: true });
    };

    const handleCreate = () => {
        form.reset();
        form.setData(emptyItemCategoryForm);
        setErrors({});
        setOpenForm(true);
    };

    const handleEdit = (item: ItemCategoryItem) => {
        form.setData({
            id: item.id,
            code: item.code,
            name: item.name,
            is_active: item.is_active,
        });
        // ห้ามเลือก parent_id ที่เป็นตัวเองหรือ child ของตัวเอง
        form.setData('parent_id', item.parent_id || '');
        setErrors({});
        setOpenForm(true);
    };

    const handleDelete = (item: ItemCategoryItem) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t,
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            parent_id: form.data.parent_id,
            code: form.data.code,
            name: form.data.name,
            is_active: form.data.is_active,
        };

        setProcessing(true);

        const options = {
            preserveScroll: true,
            onError: (errors: Record<string, string>) => {
                setErrors(errors);
            },
            onSuccess: () => {
                setOpenForm(false);
                form.reset();
            },
            onFinish: () => {
                setProcessing(false);
            },
        };

        if (form.data.id) {
            router.put(update(form.data.id), payload, options);

            return;
        }

        router.post(store(), payload, options);
    };

    const confirmDelete = () => {
        if (!selectedItem) {
            return;
        }

        setProcessing(true);

        router.delete(destroy(selectedItem.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpenDelete(false);
                setSelectedItem(null);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

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

                <div className="grid gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-3 lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>{t('item_categories.total')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {items.total}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {hasFilters
                                    ? t('item_categories.matching_filters')
                                    : t('item_categories.module_total')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>
                                {t('item_categories.active_on_page')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {activeCount}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('item_categories.active_card_description')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>
                                {t('item_categories.inactive_on_page')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {inactiveCount}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('item_categories.inactive_card_description')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="gap-3 py-3">
                    <CardContent>
                        <form
                            className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_12rem_11rem_auto_auto]"
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitFilters();
                            }}
                        >
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={filterValues.search}
                                    onChange={(e) =>
                                        setFilterValues((current) => ({
                                            ...current,
                                            search: e.target.value,
                                        }))
                                    }
                                    className="pl-9"
                                    placeholder={t(
                                        'item_categories.search_placeholder',
                                    )}
                                />
                            </div>

                            <Select
                                value={filterValues.status || 'all'}
                                onValueChange={(value) =>
                                    setFilterValues((prev) => ({
                                        ...prev,
                                        status: value === 'all' ? '' : value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('ui.status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('ui.all_statuses')}
                                    </SelectItem>
                                    <SelectItem value="active">
                                        {t('ui.active')}
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        {t('ui.inactive')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filterValues.per_page.toString()}
                                onValueChange={(value) =>
                                    setFilterValues((prev) => ({
                                        ...prev,
                                        per_page: Number(value),
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('ui.rows')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 15, 25, 50].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={size.toString()}
                                        >
                                            {size} {t('ui.rows')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button type="submit" variant="secondary">
                                <Filter className="size-4" />
                                {t('ui.apply')}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetFilters}
                            >
                                <X className="size-4" />
                                {t('ui.reset')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="gap-0 py-0">
                    <CardHeader className="border-b py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>
                                    {t('item_categories.title')}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {t('item_categories.showing', {
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
                            emptyDescription={t(
                                'item_categories.empty_description',
                            )}
                            emptyTitle={t('item_categories.empty_title')}
                        />
                    </CardContent>
                </Card>

                <AppPagination links={items.links} />
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
