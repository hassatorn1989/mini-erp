import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslations } from '@/hooks/use-translations';

type OpenDialog = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

type AppConfirmProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    openDialog: OpenDialog;
    disable: boolean;
    onClick: () => void;
    buttonLabel?: React.ReactNode;
};

function AppConfirm({
    icon,
    title,
    description,
    openDialog,
    disable,
    onClick,
    buttonLabel,
}: AppConfirmProps) {
    const { t } = useTranslations();

    return (
        <>
            <AlertDialog open={openDialog.open} onOpenChange={openDialog.setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive">
                            {icon}
                        </AlertDialogMedia>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={disable}>
                            {t('ui.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={disable}
                            onClick={onClick}
                        >
                            {buttonLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default AppConfirm;
