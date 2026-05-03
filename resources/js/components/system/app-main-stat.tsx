import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';

type itemProps = {
    total: number;
    activeCount: number;
    inactiveCount: number;
    hasFilters: boolean;
};

function AppMainStat({ total, activeCount, inactiveCount, hasFilters }: itemProps) {
    const { t } = useTranslations();

    return (
        <>
            <div className="grid gap-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs md:grid-cols-3 lg:px-0 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                <Card size="sm">
                    <CardHeader>
                        <CardTitle>{t('prefixes.total')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {total}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {hasFilters
                                ? t('prefixes.matching_filters')
                                : t('prefixes.module_total')}
                        </p>
                    </CardContent>
                </Card>

                <Card size="sm">
                    <CardHeader>
                        <CardTitle>{t('prefixes.active_on_page')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {activeCount}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('prefixes.active_card_description')}
                        </p>
                    </CardContent>
                </Card>

                <Card size="sm">
                    <CardHeader>
                        <CardTitle>{t('prefixes.inactive_on_page')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {inactiveCount}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('prefixes.inactive_card_description')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default AppMainStat;
