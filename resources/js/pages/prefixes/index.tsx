import Heading from '@/components/heading';
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
import { dashboard } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function PrefixIndex() {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: '',
    });

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
    };

    return (
        <>
            <Head title="Prefixes" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Heading title="asdas" description="asdasd" />

                    <Button onClick={() => handleOpenChange(true)}>
                        <Plus />
                        สร้างรายการ
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <form>
                    <DialogTrigger asChild>
                        <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save
                                when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        {/* <FieldGroup>
                            <Field>
                                <Label htmlFor="name-1">Name</Label>
                                <Input
                                    id="name-1"
                                    name="name"
                                    defaultValue="Pedro Duarte"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="username-1">Username</Label>
                                <Input
                                    id="username-1"
                                    name="username"
                                    defaultValue="@peduarte"
                                />
                            </Field>
                        </FieldGroup> */}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    );
}

PrefixIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Prefixes',
            href: '#',
        },
    ],
};
