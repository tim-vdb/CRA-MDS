import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
 
const badgeVariants = cva(
    'flex-row items-center rounded-full px-2.5 py-0.5',
    {
        variants: {
            variant: {
                default: 'bg-primary',
                secondary: 'bg-secondary',
                destructive: 'bg-destructive',
                outline: 'border border-border',
                success: 'bg-green-100',
            },
        },
        defaultVariants: { variant: 'default' },
    }
);
 
const textVariants = cva('text-xs font-semibold', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            secondary: 'text-secondary-foreground',
            destructive: 'text-destructive-foreground',
            outline: 'text-foreground',
            success: 'text-green-700',
        },
    },
    defaultVariants: { variant: 'default' },
});
 
type BadgeProps = VariantProps<typeof badgeVariants> & {
    label: string;
    className?: string;
};
 
export function Badge({ label, variant, className }: BadgeProps) {
    return (
        <View className={cn(badgeVariants({ variant }), className)}>
            <Text className={cn(textVariants({ variant }))}>{label}</Text>
        </View>
    );
}