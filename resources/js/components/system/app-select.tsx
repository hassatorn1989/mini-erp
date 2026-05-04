import React from 'react';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Options = {
    value: string;
    label: string;
};

type AppSelectProps = {
    label?: string;
    error?: boolean | string;
    placeholder?: string;
    value: string;
    options: Options[];
    onChange: (value: string) => void;
    disabled?: boolean;
    isRequired?: boolean;
};
function AppSelect({
    label,
    error,
    placeholder,
    value,
    options,
    onChange,
    disabled,
    isRequired = false,
}: AppSelectProps) {
    return (
        <>
            <Field data-invalid={!!error}>
                {label && (
                    <FieldLabel>
                        {label}
                        {isRequired && (
                            <span className="text-destructive">*</span>
                        )}
                    </FieldLabel>
                )}
                <FieldContent>
                    <Select
                        value={value}
                        onValueChange={onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            className="w-full"
                            aria-invalid={!!error}
                        >
                            <SelectValue
                                placeholder={'-- ' + placeholder + ' --'}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value.toString()}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

export default AppSelect;
