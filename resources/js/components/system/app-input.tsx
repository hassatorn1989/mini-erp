import React from 'react';
import type {
    FieldError,
    UseFormRegister,
} from 'react-hook-form';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type AppInputProps = {
    label: string;
    registration?: ReturnType<UseFormRegister<any>>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
};
function AppInput({
    label,
    registration,
    onChange,
    error,
    required = false,
    disabled = false,
    placeholder = '',
    type = 'text',
}: AppInputProps) {

    return (
        <Field data-invalid={!!error}>
            {label && (
                <FieldLabel>
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </FieldLabel>
            )}

            <FieldContent>
                <Input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-invalid={!!error}
                    {...registration}
                    onChange={onChange}
                />

                {error && (
                    <FieldDescription className="text-destructive">
                        {error.message}
                    </FieldDescription>
                )}
            </FieldContent>
        </Field>
    );
}

export default AppInput;
