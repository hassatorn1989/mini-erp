export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Filters = {
    search: string;
    status: string;
    per_page: number;
};

export type defaultOptions = {
    value: number | string;
    label: string;
};
