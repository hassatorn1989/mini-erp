import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { index as prefixIndex } from '@/actions/App/Http/Controllers/PrefixController';
import { index as departmentIndex } from '@/actions/App/Http/Controllers/DepartmentController';
import { index as positionIndex } from '@/actions/App/Http/Controllers/PositionController';
import { index as warehouseIndex } from '@/actions/App/Http/Controllers/WarehouseController';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Warehouses',
        href: warehouseIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Prefixes',
        href: prefixIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Departments',
        href: departmentIndex(),
        icon: LayoutGrid,
    },
    {
        title: 'Positions',
        href: positionIndex(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title="Main" />
                <NavMain items={settingsNavItems} title="Settings" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
