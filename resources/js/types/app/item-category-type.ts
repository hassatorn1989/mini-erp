import type { PaginationLink } from "@/types/default";


export type ParentCategoryOption = {
    id: string;
    code: string;
    name: string;
};

export type ItemCategoryItem = {
    id: string;
    parent_id: string | null;
    code: string;
    name: string;
    is_active: boolean;
    created_at: string | null;
    parent?: ParentCategoryOption | null;
};

export type ItemCategoryFormState = {
    id?: string | null;
    parent_id: string | null;
    code: string;
    name: string;
    is_active: boolean;
};

export const emptyItemCategoryForm: ItemCategoryFormState = {
    id: null,
    parent_id: null,
    code: '',
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
