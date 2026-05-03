import { Filter, Search, X } from 'lucide-react';
import React from 'react';
import AppInput from '@/components/system/app-input';
import AppSelect from '@/components/system/app-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { defaultPerPage, perPages, statusActiveOptions } from '@/constants/app';
import { useTranslations } from '@/hooks/use-translations';

type FilterValues = {
    search: string;
    status: string;
    per_page: number;
};

type SetFilterValues = {
    (value: FilterValues): void;
};

type FilterProps = {
    onChangeValues: {
        value: FilterValues;
        setValue: SetFilterValues;
    };
    submitFilters: React.FormEventHandler<HTMLFormElement>;
    resetFilters: () => void;
};

function FilterForm({
    onChangeValues: { value: filter, setValue: setFilter },
    submitFilters,
    resetFilters,
}: FilterProps) {
    const { t } = useTranslations();

    return (
        <>
            <Card className="gap-3 py-3">
                <CardContent>
                    <form
                        className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_12rem_11rem_auto_auto]"
                        onSubmit={submitFilters}
                    >
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <AppInput
                                type="text"
                                value={filter.search}
                                onChange={(value) =>
                                    setFilter({ ...filter, search: value })
                                }
                                placeholder={t('prefixes.search_placeholder')}
                                className="pl-9"
                            />
                        </div>
                        <AppSelect
                            value={filter.status || 'all'}
                            onChange={(value) =>
                                setFilter((current) => ({
                                    ...current,
                                    status: value === 'all' ? '' : value,
                                }))
                            }
                            options={statusActiveOptions.map((status) => ({
                                value: status,
                                label: t(`ui.${status}_statuses`),
                            }))}
                        />

                        <AppSelect
                            value={filter.per_page.toString()}
                            onChange={(value) =>
                                setFilter((current) => ({
                                    ...current,
                                    per_page: parseInt(value, defaultPerPage),
                                }))
                            }
                            options={perPages.map((perPage) => ({
                                value: perPage.toString(),
                                label: `${perPage} ${t('ui.rows')}`,
                            }))}
                        />

                        <Button type="submit" variant="secondary">
                            <Filter className="size-4" />
                            {t('ui.apply')}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            <X className="size-4" />
                            {t('ui.reset')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

export default FilterForm;
