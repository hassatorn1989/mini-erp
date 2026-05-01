export type ItemCategoryItem = {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type ItemCategoryPaginate = {
    data: ItemCategoryItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
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
