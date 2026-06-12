import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
 
const buttonVariants = cva(
    'flex-row items-center justify-center rounded-md active:opacity-80',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                destructive: 'bg-destructive',
                outline: 'border border-border bg-background',
                secondary: 'bg-secondary',
                ghost: '',
            },
            size: {
                default: 'h-10 px-4 gap-2',
                sm: 'h-8 px-3 gap-1.5',
                lg: 'h-12 px-6 gap-2',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);
 
const textVariants = cva('text-sm font-medium', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            destructive: 'text-destructive-foreground',
            outline: 'text-foreground',
            secondary: 'text-secondary-foreground',
            ghost: 'text-foreground',
        },
    },
    defaultVariants: { variant: 'default' },
});
 
type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
    VariantProps<typeof buttonVariants> & {
        label?: string;
        loading?: boolean;
    };
 
export function Button({ label, loading, variant, size, className, disabled, children, ...props }: ButtonProps) {
    return (
        <Pressable
            {...props}
            disabled={disabled || loading}
            className={cn(buttonVariants({ variant, size }), (disabled || loading) && 'opacity-50', className)}
        >
            {loading && <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? '#09090b' : '#fafafa'} />}
            {label ? <Text className={cn(textVariants({ variant }))}>{label}</Text> : (children as React.ReactNode)}
        </Pressable>
    );
}