import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Users } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useUsers } from '../hooks';
import type { User } from '../types';
 
function UserRow({ user }: { user: User }) {
    const initials = (user.name ?? user.email)
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
 
    return (
        <View className="flex-row items-center gap-3 px-4 py-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <Text className="text-sm font-semibold text-secondary-foreground">{initials}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-sm font-medium text-foreground">{user.name ?? '—'}</Text>
                <Text className="text-xs text-muted-foreground">{user.email}</Text>
            </View>
            <Badge
                label={user.role ?? 'MEMBER'}
                variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
            />
        </View>
    );
}
 
export default function UsersScreen() {
    const { data: users = [], isLoading, error, refetch, isRefetching } = useUsers();
 
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }
 
    if (error) {
        return (
            <View className="flex-1 items-center justify-center gap-4 px-8">
                <Text className="text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : 'Erreur inconnue'}
                </Text>
                <Button label="Réessayer" variant="outline" onPress={() => refetch()} />
            </View>
        );
    }
 
    return (
        <FlatList
            data={users}
            keyExtractor={(u) => u.id}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
            contentContainerStyle={{ padding: 16, gap: 0 }}
            ListHeaderComponent={
                <Text className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {users.length} utilisateur{users.length > 1 ? 's' : ''}
                </Text>
            }
            ListEmptyComponent={
                <View className="mt-24 items-center gap-3 px-8">
                    <View className="rounded-full bg-muted p-4">
                        <Users size={28} color="#a1a1aa" />
                    </View>
                    <Text className="text-sm text-muted-foreground">Aucun utilisateur</Text>
                </View>
            }
            renderItem={({ item, index }) => (
                <Card className={index === 0 ? '' : 'mt-0 rounded-t-none border-t-0'}>
                    <CardContent className="p-0">
                        <UserRow user={item} />
                        {index < users.length - 1 && <Separator className="ml-16" />}
                    </CardContent>
                </Card>
            )}
        />
    );
}