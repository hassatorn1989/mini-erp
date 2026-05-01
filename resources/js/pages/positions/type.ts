export type PositionItem = {
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

export type PositionPaginate = {
    data: PositionItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
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
