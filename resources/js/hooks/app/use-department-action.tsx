import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/DepartmentController';

import type { DepartmentFormState, DepartmentItem } from '@/types/app/department-type';
import type { Filters } from '@/types/default';
import { getColumns } from '../../pages/departments/column';

type UseDepartmentActionsProps = {
    t: (key: string) => string;
    filterValues: Filters;
    setFilterValues: React.Dispatch<React.SetStateAction<Filters>>;
    defaultFilters: Filters;
    emptyDepartmentForm: DepartmentFormState;
};

export function useDepartmentActions({
    t,
    filterValues,
    setFilterValues,
    defaultFilters,
    emptyDepartmentForm,
}: UseDepartmentActionsProps) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DepartmentItem | null>(null);
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
    } = useForm<DepartmentFormState>({
        defaultValues: emptyDepartmentForm,
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
        reset({ ...emptyDepartmentForm });
        setOpenForm(true);
    }

    const handleEdit = (item: DepartmentItem) => {
        reset({
            id: item.id,
            code: item.code,
            name: item.name,
            is_active: item.is_active,
        });
        setOpenForm(true);
    }

    const handleDelete = (item: DepartmentItem) => {
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

    const onSubmit = (data: DepartmentFormState) => {
        setProcessing(true);
        const payload = {
            code: data.code,
            name: data.name,
            is_active: data.is_active,
        };

        if (data.id) {
            router.put(update(data.id), payload, {
                preserveScroll: true,
                onError: (errors) => {
                    Object.entries(errors).forEach(([field, message]) => {
                        setError(field as keyof DepartmentFormState, { message });
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
                    setError(field as keyof DepartmentFormState, { message });
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
