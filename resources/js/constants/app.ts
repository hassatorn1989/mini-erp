import type { Filters } from "@/types/default";


export const perPages = [10, 25, 50, 100];
export const defaultPerPage = 10;

export const defaultFilters: Filters = {
    search: '',
    status: '',
    per_page: 10,
};

export const statusActiveOptions = ['all', 'active', 'inactive'];
