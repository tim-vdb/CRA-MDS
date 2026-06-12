import { View, Text } from 'react-native';
import { cn } from '@/lib/cn';
 
type ViewProps = React.ComponentPropsWithoutRef<typeof View>;
 
function Card({ className, ...props }: ViewProps) {
    return (
        <View
            className={cn('rounded-lg border border-border bg-card', className)}
            {...props}
        />
    );
}
 
function CardHeader({ className, ...props }: ViewProps) {
    return <View className={cn('p-4 pb-2', className)} {...props} />;
}
 
function CardContent({ className, ...props }: ViewProps) {
    return <View className={cn('p-4 pt-2', className)} {...props} />;
}
 
function CardFooter({ className, ...props }: ViewProps) {
    return <View className={cn('flex-row items-center p-4 pt-0', className)} {...props} />;
}
 
function CardTitle({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Text>) {
    return (
        <Text className={cn('text-base font-semibold text-card-foreground', className)} {...props}>
            {children}
        </Text>
    );
}
 
function CardDescription({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Text>) {
    return (
        <Text className={cn('text-sm text-muted-foreground', className)} {...props}>
            {children}
        </Text>
    );
}
 
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };