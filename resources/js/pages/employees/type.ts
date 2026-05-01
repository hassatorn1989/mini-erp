import type { PaginationLink } from '@/types/default';

export type EmployeeItem = {
    id: string;
    prefix_id: string;
    position_id: string;
    department_id: string;
    code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    hire_date: string;
    termination_date: string | null;
    is_active: boolean;
    created_at: string | null;
    position?: {
        id: string;
        name: string;
    };
    department?: {
        id: string;
        name: string;
    };
    user?: {
        username: string;
    };
};

export type EmployeeFormState = {
    id?: string | null;
    prefix_id: string;
    position_id: string;
    department_id: string;
    code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    hire_date: string;
    termination_date: string | null;
    is_active: boolean;

    // user fields
    username: string;
    password: string;
};


export const employeeEmptyForm: EmployeeFormState = {
    id: null,
    prefix_id: '',
    position_id: '',
    department_id: '',
    code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hire_date: '',
    termination_date: null,
    is_active: true,

    // user fields
    username: '',
    password: '',
};

export type EmployeePaginate = {
    data: EmployeeItem[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
