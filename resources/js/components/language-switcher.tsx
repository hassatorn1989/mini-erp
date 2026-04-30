import { router } from '@inertiajs/react';
import { update } from '@/actions/App/Http/Controllers/LocaleController';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useTranslations } from '@/hooks/use-translations';

export default function LanguageSwitcher() {
    const { availableLocales, locale, t } = useTranslations();

    const switchLocale = (nextLocale: string) => {
        if (nextLocale === locale) {
            return;
        }

        router.post(update(nextLocale), {}, { preserveScroll: true });
    };

    return (
        <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
                {t('ui.language')}
            </span>
            <ButtonGroup>
                {Object.entries(availableLocales).map(([code, label]) => (
                    <Button
                        key={code}
                        type="button"
                        size="xs"
                        variant={locale === code ? 'default' : 'outline'}
                        onClick={() => switchLocale(code)}
                        title={label}
                    >
                        {code.toUpperCase()}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
}
