import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/ItemCategoryController';

import type { ItemCategoryFormState, ItemCategoryItem } from '@/types/app/item-category-type';
import type { Filters } from '@/types/default';
import { getColumns } from './column';


type UseItemCategoryActionsProps = {
    t: (key: string) => string;
    form: {
        data: ItemCategoryFormState;
        setData: (data: ItemCategoryFormState) => void;
        reset: () => void;
    };
    filterValues: Filters;
    setFilterValues: React.Dispatch<React.SetStateAction<Filters>>;
    defaultFilters: Filters;
    emptyItemCategoryForm: ItemCategoryFormState;
};

export function useItemCategoryActions({
    t,
    form,
    filterValues,
    setFilterValues,
    defaultFilters,
    emptyItemCategoryForm,
}: UseItemCategoryActionsProps) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemCategoryItem | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            parent_id: item.parent_id,
            is_active: item.is_active,
        });

        setErrors({});
        setOpenForm(true);
    };

    const handleDelete = (item: ItemCategoryItem) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            code: form.data.code,
            name: form.data.name,
            parent_id: form.data.parent_id,
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

    const columns = useMemo(
        () =>
            getColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
                t,
            }),
        [t],
    );

    return {
        columns,

        openForm,
        setOpenForm,

        openDelete,
        setOpenDelete,

        selectedItem,
        setSelectedItem,

        processing,
        errors,

        submitFilters,
        resetFilters,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSubmit,
        confirmDelete,
    };
}
