import { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { Plus, Users } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { useClients } from '../hooks';
import type { Client } from '../types';
import { ClientCard } from './ClientCard';
import { ClientFormModal } from './ClientFormModal';

export default function ClientsScreen() {
    const { data: clients = [], isLoading, error, refetch, isRefetching } = useClients();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Client | null>(null);

    const active = clients.filter((c) => c.isActive);
    const archived = clients.filter((c) => !c.isActive);

    function openCreate() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(client: Client) {
        setEditing(client);
        setModalOpen(true);
    }

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
        <View className="flex-1">
            <FlatList
                data={active}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ClientCard client={item} onEdit={openEdit} />}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
                }
                ListHeaderComponent={
                    active.length > 0 ? (
                        <Text className="mx-4 mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {active.length} client{active.length > 1 ? 's' : ''}
                        </Text>
                    ) : null
                }
                ListFooterComponent={
                    archived.length > 0 ? (
                        <View className="mt-4">
                            <Text className="mx-4 mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                Archives ({archived.length})
                            </Text>
                            {archived.map((c) => (
                                <ClientCard key={c.id} client={c} onEdit={openEdit} />
                            ))}
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View className="mt-24 items-center gap-3 px-8">
                        <View className="rounded-full bg-muted p-4">
                            <Users size={28} color="#a1a1aa" />
                        </View>
                        <Text className="text-center text-sm font-medium text-foreground">
                            Aucun client pour le moment
                        </Text>
                        <Text className="text-center text-sm text-muted-foreground">
                            Créez votre premier client pour commencer à suivre votre activité.
                        </Text>
                        <Button label="Créer un client" onPress={openCreate} className="mt-2" />
                    </View>
                }
            />

            {/* FAB */}
            {clients.length > 0 && (
                <Pressable
                    onPress={openCreate}
                    className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary active:opacity-80"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 6,
                    }}
                >
                    <Plus size={24} color="#fafafa" />
                </Pressable>
            )}

            <ClientFormModal
                visible={modalOpen}
                client={editing}
                onClose={() => setModalOpen(false)}
            />
        </View>
    );
}
