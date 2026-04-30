import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

import { dashboard } from '@/routes';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PrefixItem, getColumns } from './column';
import { AppDataTable } from '@/components/system/app-datatable';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filters, PaginatedPrefixes } from './type';
import { AppPagination } from '@/components/system/app-pagination';
import { AppDialog } from '@/components/system/app-dialog';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PrefixController';
export default function PrefixIndex({
    items,
    filters,
}: {
    items: PaginatedPrefixes;
    filters: Filters;
}) {
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PrefixItem | null>(null);
    const [filterValues, setFilterValues] = useState<Filters>(filters);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const form = useForm({
        id: null,
        name: '',
        is_active: true,
    });

    const handleCreate = () => {
        setOpenForm(true);
        setErrors({});
        form.reset();
    };

    const handleEdit = (item: PrefixItem) => {
        setOpenForm(true);
        setErrors({});
        form.setData({
            id: item.id,
            name: item.name,
            is_active: item.is_active,
        });
    };

    const handleDelete = (item: PrefixItem) => {
        setSelectedItem(item);
        setOpenDelete(true);
    };

    const columns = useMemo(
        () =>
            getColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [],
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: form.data.name,
            is_active: form.data.is_active,
        };

        setProcessing(true);

        if (form.data.id) {
            router.put(update(form.data.id), payload, {
                preserveScroll: true,
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                onSuccess: () => {
                    setOpenForm(false);
                    form.reset();
                },
                onFinish: () => {
                    setProcessing(false);
                },
            });
        } else {
            router.post(store(), payload, {
                preserveScroll: true,
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                onSuccess: () => {
                    setOpenForm(false);
                    form.reset();
                },
                onFinish: () => {
                    setProcessing(false);
                },
            });
        }
    };

    return (
        <>
            <Head title="Prefixes" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Heading title="asdas" description="asdasd" />
                    <p>{form.processing ? 'Loading...' : 'Ready'}</p>
                    <Button onClick={handleCreate}>
                        <Plus />
                        สร้างรายการ
                    </Button>
                </div>
                <form
                    className="grid gap-3 rounded-lg border bg-card p-3 md:grid-cols-[minmax(14rem,1fr)_10rem_8rem_8rem_8rem]"
                    onSubmit={(e) => e.preventDefault()}
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
                            placeholder="Search by name"
                        />
                    </div>
                    <Select
                        value={filterValues.status}
                        onValueChange={(value) =>
                            setFilterValues((prev) => ({
                                ...prev,
                                status: value,
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {['all', 'active', 'inactive'].map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filterValues.per_page.toString()}
                        onValueChange={(value) =>
                            setFilterValues((prev) => ({
                                ...prev,
                                per_page: parseInt(value, 10),
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50, 100].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button>
                        <Search className="size-4" />
                        Apply
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setFilterValues({
                                search: '',
                                status: '',
                                per_page: 10,
                            });
                            form.reset('search', 'status', 'per_page');
                        }}
                    >
                        <X className="size-4" />
                        Reset
                    </Button>
                </form>
                <AppDataTable columns={columns} data={items.data} />
                <div className="flex items-center justify-between">
                    <div className="hidden text-sm text-muted-foreground sm:block">
                        แสดง {items.from ?? 0} - {items.to ?? 0} จากทั้งหมด{' '}
                        {items.total} รายการ
                    </div>
                    <AppPagination links={items.links} />
                </div>
            </div>

            <AppDialog
                open={openForm}
                onOpenChange={setOpenForm}
                title="สร้าง Prefix ใหม่"
                description="กรุณากรอกข้อมูลด้านล่างเพื่อสร้าง Prefix ใหม่"
                processing={processing}
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
            >
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="input-invalid">
                            คำนำหน้า <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="input-invalid"
                            aria-invalid={!!errors.name}
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        {errors.name && (
                            <FieldDescription className="text-destructive">
                                {errors.name}
                            </FieldDescription>
                        )}
                    </Field>
                </FieldGroup>
            </AppDialog>
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
            href: '#',
        },
    ],
};
