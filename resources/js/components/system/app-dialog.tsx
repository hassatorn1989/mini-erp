import { Save, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';
import { Spinner } from '../ui/spinner';

type AppDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    description?: string;

    children: ReactNode;

    submitLabel?: string;
    cancelLabel?: string;
    processing?: boolean;

    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function AppDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    submitLabel,
    cancelLabel,
    processing = false,
    onSubmit,
}: AppDialogProps) {
    const { t } = useTranslations();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={onSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>

                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="space-y-4">{children}</div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                            >
                                <X className="size-4" />
                                {cancelLabel ?? t('ui.cancel')}
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Spinner className="size-4 animate-spin" />
                                    {t('ui.saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    {submitLabel ?? t('ui.save')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
