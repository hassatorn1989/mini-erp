import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { PrefixItem, columns } from './column';
import { AppDataTable } from '@/components/system/app-datatable';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
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

export default function PrefixIndex({
    items,
    filters,
}: {
    items: PaginatedPrefixes;
    filters: Filters;
}) {
    const [open, setOpen] = useState(false);
    const [filterValues, setFilterValues] = useState<Filters>(filters);

    const form = useForm({
        name: '',
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
    };

    return (
        <>
            <Head title="Prefixes" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Heading title="asdas" description="asdasd" />

                    <Button onClick={() => handleOpenChange(true)}>
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
                    <Button
                        onClick={() =>
                            form.submit('get', dashboard('prefixes'), {
                                preserveState: true,
                            })
                        }
                    >
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
                <AppDataTable columns={columns} data={items.data} />{' '}
                <div className="flex items-center justify-between">
                    <div className="hidden text-sm text-muted-foreground sm:block">
                        แสดง {items.from ?? 0} - {items.to ?? 0} จากทั้งหมด{' '}
                        {items.total} รายการ
                    </div>
                    <AppPagination links={items.links} />
                </div>
            </div>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <form>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save
                                when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name-1">Name</FieldLabel>
                                <Input
                                    id="name-1"
                                    name="name"
                                    defaultValue="Pedro Duarte"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="username-1">
                                    Username
                                </FieldLabel>
                                <Input
                                    id="username-1"
                                    name="username"
                                    defaultValue="@peduarte"
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
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
