import type { PaginationLink } from "@/types/default";

export type WarehouseItem = {
    id: string;
    code: string;
    name: string;
    type: 'main' | 'third_party';
    is_active: boolean;
    created_at: string | null;
};

export type Filters = {
    search: string;
    status: string;
    per_page: number;
};

export type WarehouseFormState = {
    id?: string | null;
    code: string;
    name: string;
    type: 'main' | 'third_party';
    is_active: boolean;
};

export const emptyForm: WarehouseFormState = {
    id: null,
    code: '',
    name: '',
    type: 'main',
    is_active: true,
};

export type WarehousePaginate = {
    data: WarehouseItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
