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
import type { WarehouseItem } from './type';

type ColumnsProps = {
    onEdit: (item: WarehouseItem) => void;
    onDelete: (item: WarehouseItem) => void;
    t: (key: string) => string;
};

export const getColumns = ({
    onEdit,
    onDelete,
    t,
}: ColumnsProps): ColumnDef<WarehouseItem>[] => [
    {
        accessorKey: 'code',
        header: t('warehouses.code'),
        size: 15,
        cell: ({ row }) => {
            const code = row.getValue<string>('code');

            return <span className="font-medium text-foreground">{code}</span>;
        },
    },
    {
        accessorKey: 'name',
        header: t('warehouses.name'),
        size: 30,
        cell: ({ row }) => {
            const name = row.getValue<string>('name');

            return <span className="font-medium text-foreground">{name}</span>;
        },
    },
    {
        accessorKey: 'type',
        header: t('warehouses.type'),
        size: 20,
        cell: ({ row }) => {
            const type = row.getValue<string>('type');

            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                        type === 'main'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20'
                            : 'bg-cyan-50 text-cyan-700 ring-cyan-600/15 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-400/20'
                    }`}
                >
                    <span
                        className={`size-1.5 rounded-full ${
                            type === 'main'
                                ? 'bg-emerald-500'
                                : 'bg-cyan-500'
                        }`}
                    />
                    {type === 'main' ? t('warehouses.types.main') : t('warehouses.types.third_party')}
                </span>
            );
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
