import { usePage } from '@inertiajs/react';

type TranslationValue = string | TranslationTree;

type TranslationTree = {
    [key: string]: TranslationValue;
};

type TranslationProps = {
    availableLocales?: Record<string, string>;
    locale?: string;
    translations?: TranslationTree;
};

function getTranslationValue(
    translations: TranslationTree,
    key: string,
): TranslationValue | undefined {
    return key
        .split('.')
        .reduce<TranslationValue | undefined>((value, segment) => {
            if (value && typeof value === 'object') {
                return value[segment];
            }

            return undefined;
        }, translations);
}

function replacePlaceholders(
    value: string,
    replacements: Record<string, string | number>,
): string {
    return Object.entries(replacements).reduce(
        (translation, [key, replacement]) =>
            translation.replaceAll(`:${key}`, String(replacement)),
        value,
    );
}

export function useTranslations() {
    const {
        availableLocales = {},
        locale = 'th',
        translations = {},
    } = usePage<TranslationProps>().props;

    const t = (
        key: string,
        replacements: Record<string, string | number> = {},
    ): string => {
        const value = getTranslationValue(translations, key);

        if (typeof value !== 'string') {
            return key;
        }

        return replacePlaceholders(value, replacements);
    };

    return {
        availableLocales,
        locale,
        t,
    };
}
