'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item } from './type';
import ActiveBadge from '@/components/system/active-badge';

type ColumnsProps = {
    onEdit: (item: Item) => void;
    onDelete: (item: Item) => void;
};

export const getColumns = ({
    onEdit,
    onDelete,
}: ColumnsProps): ColumnDef<Item>[] => [
    // {
    //     id: 'row_no',
    //     header: '#',
    //     size: 5,
    //     cell: ({ row }) => row.index + 1,
    // },
    {
        accessorKey: 'name',
        header: 'Name',
        size: 40,
        cell: ({ row }) => {
            const name = row.getValue<string>('name');

            return name;
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        size: 10,
        cell: ({ row }) => {
            const isActive = row.getValue<boolean>('is_active');

            return <ActiveBadge isActive={isActive} />;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        size: 20,
        cell: ({ row }) => {
            const createdAt = row.getValue<string>('created_at');

            return createdAt;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        size: 20,
        cell: ({ row }) => {
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onEdit(item)}>
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => onDelete(item)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
