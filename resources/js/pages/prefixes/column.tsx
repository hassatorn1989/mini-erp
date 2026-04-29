'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item } from './type';
import ActiveBadge from '@/components/system/active-badge';

export const columns: ColumnDef<Item>[] = [
    {
        id: 'row_no',
        header: '#',
        size: 5,
        cell: ({ row }) => {
            return row.index + 1;
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
        size: 40,
        cell: ({ row }) => {
            const name = row.getValue('name');

            return name;
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        size: 10,
        cell: ({ row }) => {
            const isActive = row.getValue('is_active');

            return <ActiveBadge isActive={isActive} />;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        size: 20,
        cell: ({ row }) => {
            const createdAt = row.getValue('created_at');

            return createdAt;
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        size: 20,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem variant="destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
