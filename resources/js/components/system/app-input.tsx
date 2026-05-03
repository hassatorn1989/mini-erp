import React from 'react'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type AppInputProps = {
    type: string;
    label?: string;
    error?: boolean | string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    isRequired?: boolean;
    className?: string;
};

function AppInput({
    type = 'text',
    label,
    error,
    placeholder = '',
    value,
    onChange,
    disabled = false,
    isRequired = false,
    className = '',
}: AppInputProps) {
    return (
        <>
            <Field data-invalid={!!error}>
                {label && (
                    <FieldLabel>
                        {label}
                        {isRequired && <span className="text-destructive">*</span>}
                    </FieldLabel>
                )}
                <FieldContent>
                    <Input
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={className}
                        aria-invalid={!!error}
                    />
                    {error && (
                        <FieldDescription className="text-destructive">
                            {error}
                        </FieldDescription>
                    )}
                </FieldContent>
            </Field>
        </>
    );
}

export default AppInput
