import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/EmployeeController';
import type {
    EmployeeFormState,
    EmployeeItem,
} from '@/types/app/employee-type';
import type { Filters } from '@/types/default';
import { getColumns } from './column';

type UseEmployeeActionsProps = {
    t: (key: string) => string;
    form: {
        data: EmployeeFormState;
        setData: (data: EmployeeFormState) => void;
        reset: () => void;
    };
    filterValues: Filters;
    setFilterValues: React.Dispatch<React.SetStateAction<Filters>>;
    defaultFilters: Filters;
    emptyEmployeeForm: EmployeeFormState;
};

export function useEmployeeActions({
    t,
    form,
    filterValues,
    setFilterValues,
    defaultFilters,
    emptyEmployeeForm,
}: UseEmployeeActionsProps) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EmployeeItem | null>(null);
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
        form.setData(emptyEmployeeForm);
        setErrors({});
        setOpenForm(true);
    };

    const handleEdit = (item: EmployeeItem) => {
        form.setData({
            id: item.id,
            prefix_id: item.prefix_id,
            position_id: item.position_id,
            department_id: item.department_id,
            code: item.code,
            first_name: item.first_name,
            last_name: item.last_name,
            email: item.email,
            phone: item.phone,
            hire_date: item.hire_date,
            termination_date: item.termination_date,
            is_active: item.is_active,
            username: item.user?.username || '',
            password: '',
        });

        setErrors({});
        setOpenForm(true);
    };

    const handleDelete = (item: EmployeeItem) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            prefix_id: form.data.prefix_id,
            position_id: form.data.position_id,
            department_id: form.data.department_id,
            code: form.data.code,
            first_name: form.data.first_name,
            last_name: form.data.last_name,
            email: form.data.email,
            phone: form.data.phone,
            hire_date: form.data.hire_date,
            termination_date: form.data.termination_date,
            is_active: form.data.is_active,
            username: form.data.username,
            password: form.data.password,
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
