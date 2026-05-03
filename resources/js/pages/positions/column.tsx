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
import type { PositionItem } from '../../types/app/position-type';

type ColumnsProps = {
    onEdit: (item: PositionItem) => void;
    onDelete: (item: PositionItem) => void;
    t: (key: string) => string;
};

export const getColumns = ({
    onEdit,
    onDelete,
    t,
}: ColumnsProps): ColumnDef<PositionItem>[] => [
    {
        accessorKey: 'name',
        header: t('positions.name'),
        size: 45,
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
        header: t('positions.created_at'),
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
