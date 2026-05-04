'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { FolderX } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslations } from '@/hooks/use-translations';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AppPagination } from './app-pagination';

type PaginationLinkItem = {
    url: string | null;
    label: string;
    active: boolean;
};
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    itemData: TData[];
    itemFrom: number;
    itemTo: number;
    itemTotal: number;
    itemLinks: PaginationLinkItem[];
    hasFilters: boolean;
    emptyDescription?: string;
    emptyTitle?: string;
}

export function AppDataTable<TData, TValue>({
    columns,
    itemData,
    itemFrom,
    itemTo,
    itemTotal,
    itemLinks,
    hasFilters,
    emptyDescription = 'No results.',
    emptyTitle = 'No data found',
}: DataTableProps<TData, TValue>) {
    // TanStack Table intentionally returns callable table helpers from this hook.
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: itemData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { t } = useTranslations();

    return (
        <>
            <Card className="gap-0 py-0">
                <CardHeader className="border-b py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>{t('item_categories.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {t('item_categories.showing', {
                                    from: itemFrom ?? 0,
                                    to: itemTo ?? 0,
                                    total: itemTotal ?? 0,
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
                    <div className="overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50 text-muted-foreground">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead
                                                    key={header.id}
                                                    style={{
                                                        width: `${header.getSize()}%`,
                                                    }}
                                                    className="h-11 px-4 text-xs font-semibold tracking-wide uppercase"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            className="hover:bg-muted/35"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="px-4 py-3"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-48 py-12 text-center"
                                        >
                                            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                <FolderX className="size-6" />
                                            </div>
                                            <p className="text-sm font-medium">
                                                {emptyTitle}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {emptyDescription}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AppPagination links={itemLinks} />
        </>
    );
}
