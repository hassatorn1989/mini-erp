import type { PaginationLink } from "../prefixes/type";

export type PositionItem = {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string | null;
};

export type PositionFormState = {
    id?: string | null;
    name: string;
    is_active: boolean;
};


export const emptyForm: PositionFormState = {
    id: null,
    name: '',
    is_active: true,
};

export type PositionPaginate = {
    data: PositionItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
