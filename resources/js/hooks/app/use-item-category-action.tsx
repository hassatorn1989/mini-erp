import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/ItemCategoryController';

import type {
    ItemCategoryFormState,
    ItemCategoryItem,
} from '@/types/app/item-category-type';
import type { Filters } from '@/types/default';
import { getColumns } from '../../pages/item-categories/column';

type UseItemCategoryActionsProps = {
    t: (key: string) => string;
    filterValues: Filters;
    setFilterValues: React.Dispatch<React.SetStateAction<Filters>>;
    defaultFilters: Filters;
    emptyItemCategoryForm: ItemCategoryFormState;
};

export function useItemCategoryActions({
    t,
    filterValues,
    setFilterValues,
    defaultFilters,
    emptyItemCategoryForm,
}: UseItemCategoryActionsProps) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemCategoryItem | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<ItemCategoryFormState>({
        defaultValues: emptyItemCategoryForm,
    });

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
        reset({ ...emptyItemCategoryForm });
        setOpenForm(true);
    };

    const handleEdit = (item: ItemCategoryItem) => {
        reset({
            id: item.id,
            code: item.code,
            name: item.name,
            parent_id: item.parent_id,
            is_active: item.is_active,
        });

        setOpenForm(true);
    };

    const handleDelete = (item: ItemCategoryItem) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    const confirmDelete = () => {
        if (!selectedItem) {
            return;
        }

        setProcessing(true);

        router.delete(destroy(selectedItem.id), {
            preserveScroll: true,
            onError: () => {
                setProcessing(false);
            },
            onSuccess: () => {
                setOpenDelete(false);
                setSelectedItem(null);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const onSubmit = (data: ItemCategoryFormState) => {
        setProcessing(true);
        const payload = {
            code: data.code,
            name: data.name,
            parent_id: data.parent_id,
            is_active: data.is_active,
        };

        if (data.id) {
            router.put(update(data.id), payload, {
                preserveScroll: true,
                onError: (errors) => {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as keyof ItemCategoryFormState, {
                            message,
                        });
                    });
                    setProcessing(false);
                },
                onSuccess: () => {
                    setOpenForm(false);
                    reset({ ...emptyItemCategoryForm });
                    setProcessing(false);
                },
                onFinish: () => setProcessing(false),
            });

            return;
        }

        router.post(store(), payload, {
            preserveScroll: true,
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field as keyof ItemCategoryFormState, { message });
                });
                setProcessing(false);
            },
            onSuccess: () => {
                setOpenForm(false);
                reset({ ...emptyItemCategoryForm });
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const columns = useMemo(
        () =>
            getColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
                t,
            }),
        [t],
    );

    const isEditMode = !!watch('id');

    return {
        columns,

        openForm,
        setOpenForm,

        openDelete,
        setOpenDelete,
        confirmDelete,

        selectedItem,
        setSelectedItem,

        isProcessing: processing,

        submitFilters,
        resetFilters,
        handleCreate,
        handleEdit,
        handleDelete,

        // reach-hook-form
        handleSubmit: handleSubmit(onSubmit),
        register,
        setValue,
        reset,
        control,
        watch,
        errors,
        Controller,

        isEditMode,
    };
}
