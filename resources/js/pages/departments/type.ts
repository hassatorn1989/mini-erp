import type { PaginationLink } from "../warehouses/type";

export type DepartmentItem = {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
    created_at: string | null;
};

export type DepartmentFormState = {
    id?: string | null;
    code: string;
    name: string;
    is_active: boolean;
};

export const emptyForm: DepartmentFormState = {
    id: null,
    code: '',
    name: '',
    is_active: true,
};


export type DepartmentPaginate = {
    data: DepartmentItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
