import { useTranslations } from '@/hooks/use-translations';

type ActiveBadgeProps = {
    isActive: boolean;
};

function ActiveBadge({ isActive }: ActiveBadgeProps) {
    const { t } = useTranslations();

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                isActive
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20'
                    : 'bg-muted text-muted-foreground ring-foreground/10'
            }`}
        >
            <span
                className={`size-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : 'bg-muted-foreground/60'
                }`}
            />
            {isActive ? t('ui.active') : t('ui.inactive')}
        </span>
    );
}

export default ActiveBadge;
