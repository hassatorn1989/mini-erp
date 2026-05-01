import { Monitor, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslations } from '@/hooks/use-translations';

type AppearanceOption = {
    value: Appearance;
    icon: LucideIcon;
    labelKey: string;
};

const options: AppearanceOption[] = [
    { value: 'light', icon: Sun, labelKey: 'ui.light' },
    { value: 'dark', icon: Moon, labelKey: 'ui.dark' },
    { value: 'system', icon: Monitor, labelKey: 'ui.system' },
];

export default function AppearanceSwitcher() {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslations();

    return (
        <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
                {t('ui.theme')}
            </span>
            <ButtonGroup>
                {options.map(({ value, icon: Icon, labelKey }) => (
                    <Button
                        key={value}
                        type="button"
                        size="icon-xs"
                        variant={appearance === value ? 'default' : 'outline'}
                        onClick={() => updateAppearance(value)}
                        title={t(labelKey)}
                        aria-label={t(labelKey)}
                    >
                        <Icon />
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
}
