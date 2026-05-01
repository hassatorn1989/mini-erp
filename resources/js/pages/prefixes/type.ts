import type { PaginationLink } from "@/types/default";

export type PrefixItem = {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string | null;
};


export type PrefixFormState = {
    id?: string | null;
    name: string;
    is_active: boolean;
};

export const emptyForm: PrefixFormState = {
    id: null,
    name: '',
    is_active: true,
};

export type PrefixPaginate = {
    data: PrefixItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
