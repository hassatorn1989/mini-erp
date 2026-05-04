import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PositionController';

import type { PositionFormState, PositionItem } from '@/types/app/position-type';
import type { Filters } from '@/types/default';
import { getColumns } from './column';

type UsePositionActionsProps = {
    t: (key: string) => string;
    filterValues: Filters;
    setFilterValues: React.Dispatch<React.SetStateAction<Filters>>;
    defaultFilters: Filters;
    emptyPositionForm: PositionFormState;
};

export function usePositionActions({
    t,
    filterValues,
    setFilterValues,
    defaultFilters,
    emptyPositionForm,
}: UsePositionActionsProps) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PositionItem | null>(null);
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
    } = useForm<PositionFormState>({
        defaultValues: emptyPositionForm,
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
        reset();
        setOpenForm(true);
    }

    const handleEdit = (item: PositionItem) => {
        reset();
        setValue('id', item.id);
        setValue('name', item.name);
        setValue('is_active', item.is_active);

        setOpenForm(true);
    }

    const handleDelete = (item: PositionItem) => {
        setSelectedItem(item);
        setOpenDelete(true);
    }

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
    }

    const onSubmit = (data: PositionFormState) => {
        setProcessing(true);
        const payload = {
            name: data.name,
            is_active: data.is_active,
        };

        if (data.id) {
            router.put(update(data.id), payload, {
                preserveScroll: true,
                onError: (errors) => {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as keyof PositionFormState, { message });
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
                    setError(field as keyof PositionFormState, { message });
                });
                setProcessing(false);
            },
            onSuccess: () => {
                setOpenForm(false);
                reset();
                setProcessing(false);
            },
            onFinish: () =>
                setProcessing(false),
        });
    }

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
