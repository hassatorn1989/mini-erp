'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon, Pencil, Trash2 } from 'lucide-react';
import ActiveBadge from '@/components/system/active-badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DepartmentItem } from '../../types/app/department-type';

type ColumnsProps = {
    onEdit: (item: DepartmentItem) => void;
    onDelete: (item: DepartmentItem) => void;
    t: (key: string) => string;
};

export const getColumns = ({
    onEdit,
    onDelete,
    t,
}: ColumnsProps): ColumnDef<DepartmentItem>[] => [
    {
        accessorKey: 'code',
        header: t('departments.code'),
        size: 15,
        cell: ({ row }) => {
            const code = row.getValue<string>('code');

            return <span className="font-medium text-foreground">{code}</span>;
        },
    },
    {
        accessorKey: 'name',
        header: t('departments.name'),
        size: 30,
        cell: ({ row }) => {
            const name = row.getValue<string>('name');

            return <span className="font-medium text-foreground">{name}</span>;
        },
    },
    {
        accessorKey: 'is_active',
        header: t('ui.status'),
        size: 15,
        cell: ({ row }) => {
            const isActive = row.getValue<boolean>('is_active');

            return <ActiveBadge isActive={isActive} />;
        },
    },
    {
        accessorKey: 'created_at',
        header: t('prefixes.created_at'),
        size: 25,
        cell: ({ row }) => {
            const createdAt = row.getValue<string>('created_at');

            return (
                <span className="text-muted-foreground">
                    {createdAt ?? '-'}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        size: 15,
        cell: ({ row }) => {
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">{t('ui.open_menu')}</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onEdit(item)}>
                            <Pencil />
                            {t('ui.edit')}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => onDelete(item)}
                        >
                            <Trash2 />
                            {t('ui.delete')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
