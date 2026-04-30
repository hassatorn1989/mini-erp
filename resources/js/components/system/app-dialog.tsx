import { ReactNode } from 'react';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
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

    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function AppDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    submitLabel = 'บันทึก',
    cancelLabel = 'ยกเลิก',
    processing = false,
    onSubmit,
}: AppDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>

                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="space-y-4">{children}</div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Spinner className="size-4 animate-spin" />
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={processing}
                            >
                                <X className="size-4" />
                                {cancelLabel}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
