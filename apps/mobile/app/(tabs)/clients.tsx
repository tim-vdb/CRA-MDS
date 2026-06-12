import { View, Text } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import ClientsScreen from '@/features/clients/components/ClientsScreen';

const SAV = SafeAreaViewContext as any;

export default function ClientsPage() {
    return (
        <SAV edges={['top']} style={{ flex: 1 }} className="bg-zinc-50">
            <View className="flex-1 bg-zinc-50">
                <Text className="px-4 pb-2 pt-1 text-2xl font-bold text-zinc-900">Clients</Text>
                <ClientsScreen />
            </View>
        </SAV>
    );
}
