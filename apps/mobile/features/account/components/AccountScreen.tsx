import { useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput, Pressable } from 'react-native';
import { User, Mail, Shield, Trash2, LogOut, Pencil, Check, X } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSession, signOut } from '@/lib/auth-client';
import { useUpdateName, useDeleteAccount } from '../hooks';
 
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <View className="flex-row items-center gap-3 py-3">
            <View className="h-8 w-8 items-center justify-center rounded-md bg-secondary">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-xs text-muted-foreground">{label}</Text>
                <Text className="text-sm font-medium text-foreground">{value}</Text>
            </View>
        </View>
    );
}
 
export default function AccountScreen() {
    const { data: session } = useSession();
    // Better Auth's session type doesn't expose custom additionalFields — cast to include role.
    const user = session?.user as (NonNullable<typeof session>['user'] & { role?: string | null }) | undefined;
    const updateName = useUpdateName();
    const deleteAccount = useDeleteAccount();
 
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(user?.name ?? '');
 
    function initials() {
        return (user?.name ?? user?.email ?? '?')
            .split(' ')
            .map((w: string) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }
 
    function saveName() {
        if (!nameInput.trim() || nameInput === user?.name) { setEditingName(false); return; }
        updateName.mutate(nameInput.trim(), {
            onSuccess: () => setEditingName(false),
            onError: (e) => Alert.alert('Erreur', e instanceof Error ? e.message : 'inconnue'),
        });
    }
 
    function confirmDelete() {
        Alert.alert(
            'Supprimer le compte',
            `Saisissez votre email (${user?.email}) pour confirmer. Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        deleteAccount.mutate(undefined, {
                            onSuccess: () => signOut(),
                            onError: (e) =>
                                Alert.alert('Erreur', e instanceof Error ? e.message : 'inconnue'),
                        });
                    },
                },
            ]
        );
    }
 
    if (!user) return null;
 
    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16, gap: 12 }}>
 
            {/* Avatar + name */}
            <Card>
                <CardContent className="items-center gap-3 pt-6">
                    <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
                        <Text className="text-2xl font-bold text-primary-foreground">{initials()}</Text>
                    </View>
 
                    {editingName ? (
                        <View className="w-full flex-row items-center gap-2">
                            <TextInput
                                value={nameInput}
                                onChangeText={setNameInput}
                                autoFocus
                                className="flex-1 rounded-md border border-input px-3 py-2 text-base text-foreground"
                                onSubmitEditing={saveName}
                            />
                            <Pressable onPress={saveName} className="rounded-md bg-primary p-2 active:opacity-80">
                                <Check size={16} color="#fafafa" />
                            </Pressable>
                            <Pressable onPress={() => { setEditingName(false); setNameInput(user.name ?? ''); }} className="rounded-md bg-secondary p-2 active:opacity-80">
                                <X size={16} color="#3f3f46" />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable onPress={() => { setEditingName(true); setNameInput(user.name ?? ''); }} className="flex-row items-center gap-2 active:opacity-70">
                            <Text className="text-lg font-semibold text-foreground">{user.name ?? 'Sans nom'}</Text>
                            <Pencil size={14} color="#a1a1aa" />
                        </Pressable>
                    )}
 
                    <Badge label={user.role ?? 'MEMBER'} variant={user.role === 'ADMIN' ? 'default' : 'secondary'} />
                </CardContent>
            </Card>
 
            {/* Infos */}
            <Card>
                <CardHeader>
                    <CardTitle>Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <InfoRow
                        icon={<User size={14} color="#71717a" />}
                        label="Nom"
                        value={user.name ?? '—'}
                    />
                    <Separator />
                    <InfoRow
                        icon={<Mail size={14} color="#71717a" />}
                        label="Email"
                        value={user.email}
                    />
                    <Separator />
                    <InfoRow
                        icon={<Shield size={14} color="#71717a" />}
                        label="Rôle"
                        value={user.role ?? 'MEMBER'}
                    />
                </CardContent>
            </Card>
 
            {/* Session */}
            <Card>
                <CardHeader>
                    <CardTitle>Session</CardTitle>
                    <CardDescription>Gérez votre connexion</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <Button
                        variant="outline"
                        onPress={() =>
                            Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
                                { text: 'Annuler', style: 'cancel' },
                                { text: 'Se déconnecter', style: 'destructive', onPress: () => signOut() },
                            ])
                        }
                        className="gap-2"
                    >
                        <LogOut size={16} color="#3f3f46" />
                        <Text className="text-sm font-medium text-foreground">Se déconnecter</Text>
                    </Button>
                </CardContent>
            </Card>
 
            {/* Danger zone */}
            <Card className="border-destructive/40">
                <CardHeader>
                    <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                    <CardDescription>Ces actions sont irréversibles</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <Button
                        variant="destructive"
                        loading={deleteAccount.isPending}
                        onPress={confirmDelete}
                        className="gap-2"
                    >
                        <Trash2 size={16} color="#fafafa" />
                        <Text className="text-sm font-medium text-primary-foreground">Supprimer le compte</Text>
                    </Button>
                </CardContent>
            </Card>
 
            <View className="h-8" />
        </ScrollView>
    );
}