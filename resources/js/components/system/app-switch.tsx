import React from 'react';
import { Field, FieldContent, FieldDescription, FieldLabel } from '../ui/field';
import { Switch } from '../ui/switch';

type AppSwitchProps = {
    label?: string;
    description?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
};

function AppSwitch({
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
}: AppSwitchProps) {

    return (
        <>
            <Field orientation="horizontal">
                <Switch
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled}
                />
                <FieldContent>
                    {label && <FieldLabel>{label}</FieldLabel>}
                    {description && <FieldDescription>{description}</FieldDescription>}
                </FieldContent>
            </Field>
        </>
    );
}

export default AppSwitch;
