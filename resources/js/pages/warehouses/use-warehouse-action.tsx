import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/WarehouseController';

import type {
    WarehouseFormState,
    WarehouseItem,
} from '@/types/app/warehouse-type';
import type { Filters } from '@/types/default';
import { getColumns } from './column';

type UseWarehouseActionsProps = {
    t: (key: string) => string;
    filterValues: Filters;
    setFilterValues: React.Dispatch<React.SetStateAction<Filters>>;
    defaultFilters: Filters;
    emptyWarehouseForm: WarehouseFormState;
};

export function useWarehouseActions({
    t,
    filterValues,
    setFilterValues,
    defaultFilters,
    emptyWarehouseForm,
}: UseWarehouseActionsProps) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(
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
    } = useForm<WarehouseFormState>({
        defaultValues: emptyWarehouseForm,
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
        reset({ ...emptyWarehouseForm });
        setOpenForm(true);
    };

    const handleEdit = (item: WarehouseItem) => {
        reset({
            id: item.id,
            code: item.code,
            name: item.name,
            type: item.type,
            is_active: item.is_active,
        });

        setOpenForm(true);
    };

    const handleDelete = (item: WarehouseItem) => {
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

    const onSubmit = (data: WarehouseFormState) => {
        setProcessing(true);
        const payload = {
            name: data.name,
            code: data.code,
            type: data.type,
            is_active: data.is_active,
        };

        if (data.id) {
            router.put(update(data.id), payload, {
                preserveScroll: true,
                onError: (errors) => {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as keyof WarehouseFormState, {
                            message,
                        });
                    });
                    setProcessing(false);
                },
                onSuccess: () => {
                    setOpenForm(false);
                    reset();
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
                    setError(field as keyof WarehouseFormState, { message });
                });
                setProcessing(false);
            },
            onSuccess: () => {
                setOpenForm(false);
                reset();
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
