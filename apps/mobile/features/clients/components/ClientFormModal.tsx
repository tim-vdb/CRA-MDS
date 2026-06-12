import { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    ScrollView,
    Switch,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    ClientFormSchema,
    emptyClientForm,
    clientToForm,
    type Client,
    type ClientFormInput,
} from '../types';
import { useCreateClient, useUpdateClient } from '../hooks';

type Props = {
    visible: boolean;
    client: Client | null;
    onClose: () => void;
};

const TEXT_FIELDS: {
    key: keyof ClientFormInput;
    label: string;
    placeholder?: string;
    keyboard?: 'email-address' | 'phone-pad' | 'numeric';
    required?: boolean;
}[] = [
    { key: 'name', label: 'Nom', placeholder: 'Nom du client', required: true },
    { key: 'company', label: 'Société', placeholder: 'Nom de la société' },
    { key: 'email', label: 'Email', placeholder: 'email@exemple.com', keyboard: 'email-address' },
    { key: 'phone', label: 'Téléphone', placeholder: '+33 6 00 00 00 00', keyboard: 'phone-pad' },
    { key: 'address', label: 'Adresse', placeholder: '12 rue de la Paix' },
    { key: 'city', label: 'Ville', placeholder: 'Paris' },
    { key: 'postalCode', label: 'Code postal', placeholder: '75001' },
    { key: 'country', label: 'Pays', placeholder: 'France' },
    { key: 'siret', label: 'SIRET', placeholder: '000 000 000 00000' },
    { key: 'vatNumber', label: 'N° TVA', placeholder: 'FR00000000000' },
];

export function ClientFormModal({ visible, client, onClose }: Props) {
    const [form, setForm] = useState<ClientFormInput>(emptyClientForm);
    const [errors, setErrors] = useState<Partial<Record<keyof ClientFormInput, string>>>({});
    // Numeric fields are stored as raw strings while typing to avoid NaN.
    const [dailyRateStr, setDailyRateStr] = useState('');
    const [maxDaysStr, setMaxDaysStr] = useState('');
    const create = useCreateClient();
    const update = useUpdateClient();
    const isEdit = client !== null;
    const saving = create.isPending || update.isPending;

    useEffect(() => {
        if (visible) {
            const f = client ? clientToForm(client) : emptyClientForm;
            setForm(f);
            setDailyRateStr(f.dailyRate != null ? String(f.dailyRate) : '');
            setMaxDaysStr(f.maxDays != null ? String(f.maxDays) : '');
            setErrors({});
        }
    }, [visible, client]);

    function setField<K extends keyof ClientFormInput>(key: K, value: ClientFormInput[K]) {
        setForm((f) => ({ ...f, [key]: value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    }

    function handleSubmit() {
        const parseNum = (s: string) => {
            const n = parseFloat(s.replace(',', '.'));
            return isNaN(n) ? null : n;
        };
        const parsed = ClientFormSchema.safeParse({
            ...form,
            dailyRate: parseNum(dailyRateStr),
            maxDays: parseNum(maxDaysStr),
        });
        if (!parsed.success) {
            const fieldErrors: Partial<Record<keyof ClientFormInput, string>> = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0] as keyof ClientFormInput;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }
        const onError = (e: unknown) =>
            Alert.alert('Erreur', e instanceof Error ? e.message : 'inconnue');

        if (isEdit && client) {
            update.mutate({ id: client.id, input: parsed.data }, { onSuccess: onClose, onError });
        } else {
            create.mutate(parsed.data, { onSuccess: onClose, onError });
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 bg-background"
            >
                {/* Header */}
                <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
                    <Text className="text-lg font-semibold text-foreground">
                        {isEdit ? 'Modifier le client' : 'Nouveau client'}
                    </Text>
                    <Pressable
                        onPress={onClose}
                        hitSlop={8}
                        className="rounded-md p-1 active:bg-muted"
                    >
                        <X size={20} color="#3f3f46" />
                    </Pressable>
                </View>

                <ScrollView
                    className="flex-1 px-4"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
                >
                    {TEXT_FIELDS.map((field) => (
                        <Input
                            key={field.key}
                            label={field.label + (field.required ? ' *' : '')}
                            placeholder={field.placeholder}
                            value={(form[field.key] as string) ?? ''}
                            onChangeText={(t) => setField(field.key, t)}
                            keyboardType={field.keyboard ?? 'default'}
                            autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'sentences'}
                            error={errors[field.key]}
                        />
                    ))}

                    {/* TJM + maxDays — kept as raw strings while typing */}
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Input
                                label="TJM (€)"
                                placeholder="450"
                                value={dailyRateStr}
                                onChangeText={setDailyRateStr}
                                keyboardType="numeric"
                                error={errors.dailyRate}
                            />
                        </View>
                        <View className="flex-1">
                            <Input
                                label="Jours max"
                                placeholder="20"
                                value={maxDaysStr}
                                onChangeText={setMaxDaysStr}
                                keyboardType="numeric"
                                error={errors.maxDays}
                            />
                        </View>
                    </View>

                    <Separator />

                    {/* Active toggle */}
                    <View className="flex-row items-center justify-between py-1">
                        <View>
                            <Text className="text-sm font-medium text-foreground">Client actif</Text>
                            <Text className="text-xs text-muted-foreground">
                                Un client inactif est archivé
                            </Text>
                        </View>
                        <Switch
                            value={form.isActive}
                            onValueChange={(v) => setField('isActive', v)}
                        />
                    </View>

                    <View className="h-4" />
                </ScrollView>

                {/* Footer */}
                <View className="gap-2 border-t border-border px-4 py-3">
                    <Button
                        label={saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Créer le client'}
                        loading={saving}
                        onPress={handleSubmit}
                    />
                    <Button
                        label="Annuler"
                        variant="outline"
                        onPress={onClose}
                        disabled={saving}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
