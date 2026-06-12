import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Building2, ChevronRight, Power, PowerOff, Trash2, Pencil } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';
import type { Client } from '../types';
import { useDeleteClient, useToggleClient } from '../hooks';

type Props = {
    client: Client;
    onEdit: (client: Client) => void;
};

export function ClientCard({ client, onEdit }: Props) {
    const toggle = useToggleClient();
    const remove = useDeleteClient();
    const busy = toggle.isPending || remove.isPending;

    function confirmDelete() {
        Alert.alert(
            `Supprimer ${client.name} ?`,
            'Cette action supprimera définitivement ce client ainsi que toutes ses activités. Elle est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () =>
                        remove.mutate(client.id, {
                            onError: (e) =>
                                Alert.alert('Erreur', e instanceof Error ? e.message : 'inconnue'),
                        }),
                },
            ]
        );
    }

    return (
        <Card className={cn('mb-3 mx-4', !client.isActive && 'opacity-60')}>
            <CardContent className="p-0">
                {/* Main row */}
                <Pressable
                    onPress={() => onEdit(client)}
                    className="flex-row items-start justify-between gap-3 p-4 active:bg-muted/50"
                >
                    <View className="flex-1 gap-1">
                        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                            {client.name}
                        </Text>

                        {client.company ? (
                            <View className="flex-row items-center gap-1.5">
                                <Building2 size={13} color="#71717a" />
                                <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                                    {client.company}
                                </Text>
                            </View>
                        ) : null}

                        {(client.city || client.dailyRate != null) ? (
                            <Text className="text-xs text-muted-foreground">
                                {[client.city, client.dailyRate != null ? `${client.dailyRate} €/j` : null]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </Text>
                        ) : null}
                    </View>

                    <View className="flex-row items-center gap-2">
                        <Badge
                            label={client.isActive ? 'Actif' : 'Inactif'}
                            variant={client.isActive ? 'success' : 'secondary'}
                        />
                        <ChevronRight size={16} color="#a1a1aa" />
                    </View>
                </Pressable>

                <Separator />

                {/* Actions row */}
                <View className="flex-row items-center gap-1 px-2 py-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onPress={() =>
                            toggle.mutate(client.id, {
                                onError: (e) =>
                                    Alert.alert('Erreur', e instanceof Error ? e.message : 'inconnue'),
                            })
                        }
                        className="flex-1 gap-1.5"
                    >
                        {toggle.isPending ? (
                            <ActivityIndicator size="small" color="#71717a" />
                        ) : client.isActive ? (
                            <PowerOff size={15} color="#71717a" />
                        ) : (
                            <Power size={15} color="#16a34a" />
                        )}
                        <Text className="text-xs font-medium text-muted-foreground">
                            {client.isActive ? 'Archiver' : 'Réactiver'}
                        </Text>
                    </Button>

                    <Separator orientation="vertical" className="h-5" />

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onPress={() => onEdit(client)}
                        className="px-3"
                    >
                        <Pencil size={15} color="#71717a" />
                    </Button>

                    <Separator orientation="vertical" className="h-5" />

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onPress={confirmDelete}
                        className="px-3"
                    >
                        {remove.isPending ? (
                            <ActivityIndicator size="small" color="#ef4444" />
                        ) : (
                            <Trash2 size={15} color="#ef4444" />
                        )}
                    </Button>
                </View>
            </CardContent>
        </Card>
    );
}
