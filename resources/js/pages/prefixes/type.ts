export type PrefixItem = {
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

export type PaginatedPrefixes = {
    data: PrefixItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};

export type Filters = {
    search: string;
    status: string;
    per_page: number;
};

export type PrefixFormState = {
    id?: string;
    name: string;
    is_active: boolean;
};

export const emptyForm: PrefixFormState = {
    name: '',
    is_active: true,
};
