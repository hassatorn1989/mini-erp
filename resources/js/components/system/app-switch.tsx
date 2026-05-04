import React from 'react';
import { Controller } from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldLabel } from '../ui/field';
import { Switch } from '../ui/switch';

type AppSwitchProps = {
    label?: string;
    description?: string;
    disabled?: boolean;
    control: any;
    controlName: string;
};

function AppSwitch({
    label,
    description,
    disabled = false,
    control,
    controlName,
}: AppSwitchProps) {
    return (
        <>
            <Controller
                name={controlName}
                control={control}
                render={({ field }) => (
                    <Field orientation="horizontal">
                        <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                            }}
                            disabled={disabled}
                        />
                        <FieldContent>
                            {label && <FieldLabel>{label}</FieldLabel>}
                            {description && (
                                <FieldDescription>
                                    {description}
                                </FieldDescription>
                            )}
                        </FieldContent>
                    </Field>
                )}
            />
        </>
    );
}

export default AppSwitch;
