import type { PaginationLink } from "@/types/default";

export type ItemCategoryItem = {
    id: string;
    parent_id: string | null;
    name: string;
    is_active: boolean;
    created_at: string | null;
};

export type ItemCategoryFormState = {
    id?: string | null;
    name: string;
    is_active: boolean;
};

export const emptyForm: ItemCategoryFormState = {
    id: null,
    name: '',
    is_active: true,
};

export type ItemCategoryPaginate = {
    data: ItemCategoryItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
