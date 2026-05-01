import { Head, router, useForm } from '@inertiajs/react';
import { Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/EmployeeController';
import Heading from '@/components/heading';
import { AppDataTable } from '@/components/system/app-datatable';
import { AppDialog } from '@/components/system/app-dialog';
import { AppPagination } from '@/components/system/app-pagination';
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
    FieldDescription,
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
import { getColumns } from './column';
import { type EmployeePaginate, type EmployeeFormState, type EmployeeItem, employeeEmptyForm } from './type';
import { defaultFilters, Filters } from '@/types/default';


export default function EmployeeIndex({
    items,
    filters,
}: {
    items: EmployeePaginate;
    filters: Filters;
}) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EmployeeItem | null>(null);
    const [filterValues, setFilterValues] = useState<Filters>({
        ...defaultFilters,
        ...filters,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { t } = useTranslations();

    const form = useForm<EmployeeFormState>(employeeEmptyForm);

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
        form.setData(employeeEmptyForm);
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

    const columns = getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        t,
    });

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

    return (
        <>
            <Head title={t('employees.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title={t('employees.title')}
                        description={t('employees.description')}
                    />

                    <Button onClick={handleCreate} className="w-full sm:w-fit">
                        <Plus />
                        {t('employees.new')}
                    </Button>
                </div>

                <div className="grid gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-3 lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>{t('employees.total')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {items.total}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {hasFilters
                                    ? t('employees.matching_filters')
                                    : t('employees.module_total')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>
                                {t('employees.active_on_page')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {activeCount}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('employees.active_card_description')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card size="sm">
                        <CardHeader>
                            <CardTitle>
                                {t('employees.inactive_on_page')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {inactiveCount}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('employees.inactive_card_description')}
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
                                        'employees.search_placeholder',
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
                                <CardTitle>{t('employees.title')}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {t('employees.showing', {
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
                            emptyDescription={t('employees.empty_description')}
                            emptyTitle={t('employees.empty_title')}
                        />
                    </CardContent>
                </Card>

                <AppPagination links={items.links} />
            </div>

            <AppDialog
                open={openForm}
                onOpenChange={setOpenForm}
                title={isEditing ? t('employees.edit') : t('employees.create')}
                description={t('employees.dialog_description')}
                submitLabel={
                    isEditing ? t('ui.save_changes') : t('employees.create')
                }
                processing={processing}
                onSubmit={handleSubmit}
                className="max-h-[150vh] overflow-y-auto sm:max-w-[1000px]"
            >
                <FieldGroup>
                    <Field data-invalid={!!errors.code}>
                        <FieldLabel htmlFor="employee-code">
                            {t('employees.code')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="employee-code"
                            aria-invalid={!!errors.code}
                            value={form.data.code}
                            onChange={(e) =>
                                form.setData('code', e.target.value)
                            }
                            placeholder={t('employees.placeholder_code')}
                            autoFocus
                        />
                        {errors.code && (
                            <FieldDescription className="text-destructive">
                                {errors.code}
                            </FieldDescription>
                        )}
                    </Field>

                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="employee-name">
                            {t('employees.name')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="employee-name"
                            aria-invalid={!!errors.name}
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder={t('employees.placeholder_name')}
                            autoFocus
                        />
                        {errors.name && (
                            <FieldDescription className="text-destructive">
                                {errors.name}
                            </FieldDescription>
                        )}
                    </Field>

                    <Field orientation="horizontal">
                        <Switch
                            id="employee-is-active"
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked)
                            }
                        />
                        <FieldContent>
                            <FieldLabel htmlFor="employee-is-active">
                                {t('ui.active')}
                            </FieldLabel>
                            <FieldDescription>
                                {t('employees.available_hint')}
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                </FieldGroup>
            </AppDialog>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive">
                            <Trash2 />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                            {t('employees.delete_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('employees.delete_confirmation', {
                                name: selectedItem?.name ?? '',
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>
                            {t('ui.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={processing}
                            onClick={confirmDelete}
                        >
                            <Trash2 />
                            {t('ui.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

EmployeeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Employees',
            href: index(),
        },
    ],
};
