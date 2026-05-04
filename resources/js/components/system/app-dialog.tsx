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

type openDialogState = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type AppDialogProps = {
    openDialogState: openDialogState;

    title: string;
    description?: string;

    children: ReactNode;

    submitLabel?: string;
    cancelLabel?: string;
    disable?: boolean;

    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    className?: string;
};

export function AppDialog({
    openDialogState,
    title,
    description,
    children,
    submitLabel,
    cancelLabel,
    disable = false,
    onSubmit,
    className = '',
}: AppDialogProps) {
    const { t } = useTranslations();

    return (
        <Dialog
            open={openDialogState.open}
            onOpenChange={openDialogState.onOpenChange}
        >
            <DialogContent
                className={`${className}`}
                onInteractOutside={(event) => {
                    event.preventDefault();
                }}
            >
                <form onSubmit={onSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>

                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>

                    {/* <div className="space-y-4"> */}
                    <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                        {children}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={disable}
                            >
                                <X className="size-4" />
                                {cancelLabel ?? t('ui.cancel')}
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={disable}>
                            {disable ? (
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
