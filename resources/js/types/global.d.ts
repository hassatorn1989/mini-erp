import type { Auth } from '@/types/auth';
import '@inertiajs/core';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            availableLocales: Record<string, string>;
            locale: string;
            sidebarOpen: boolean;
            translations: Record<string, unknown>;
            [key: string]: unknown;
        };
    }
}
