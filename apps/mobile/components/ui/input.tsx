import { TextInput, View, Text } from 'react-native';
import { cn } from '@/lib/cn';
 
type InputProps = React.ComponentPropsWithoutRef<typeof TextInput> & {
    label?: string;
    error?: string;
    containerClassName?: string;
};
 
export function Input({ label, error, containerClassName, className, ...props }: InputProps) {
    return (
        <View className={cn('gap-1.5', containerClassName)}>
            {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
            <TextInput
                className={cn(
                    'h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                    error && 'border-destructive',
                    props.editable === false && 'opacity-50',
                    className
                )}
                placeholderTextColor="#a1a1aa"
                {...props}
            />
            {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
        </View>
    );
}