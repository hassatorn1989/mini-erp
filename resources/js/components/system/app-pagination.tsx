import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import { router } from '@inertiajs/react';

type PaginationLinkItem = {
    url: string | null;
    label: string;
    active: boolean;
};

type AppPaginationProps = {
    links: PaginationLinkItem[];
};

export function AppPagination({ links }: AppPaginationProps) {

    // if (!links || links.length <= 3) {
    //     return null;
    // }

    const goToPage = (url: string | null) => {
        if (!url) return;

        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Pagination className="justify-center md:justify-end">
            <PaginationContent>
                {links.map((link, index) => {
                    const label = link.label;

                    const isPrevious =
                        label.includes('Previous') ||
                        label.includes('&laquo;') ||
                        label.includes('ก่อนหน้า');

                    const isNext =
                        label.includes('Next') ||
                        label.includes('&raquo;') ||
                        label.includes('ถัดไป');

                    const isEllipsis = label.includes('...');

                    return (
                        <PaginationItem key={index}>
                            {isPrevious ? (
                                <PaginationPrevious
                                    href={link.url ?? '#'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToPage(link.url);
                                    }}
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            ) : isNext ? (
                                <PaginationNext
                                    href={link.url ?? '#'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToPage(link.url);
                                    }}
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            ) : isEllipsis ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={link.url ?? '#'}
                                    isActive={link.active}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToPage(link.url);
                                    }}
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: label,
                                        }}
                                    />
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
