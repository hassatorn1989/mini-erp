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

export const defaultFilters: Filters = {
    search: '',
    status: '',
    per_page: 10,
};
