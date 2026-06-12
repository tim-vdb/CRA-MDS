import { View, Text } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import UsersScreen from '@/features/users/components/UsersScreen';
 
const SAV = SafeAreaViewContext as any;
 
export default function UsersPage() {
    return (
        <SAV edges={['top']} style={{ flex: 1 }} className="bg-background">
            <View className="flex-1 bg-background">
                <Text className="px-4 pb-2 pt-1 text-2xl font-bold text-foreground">Utilisateurs</Text>
                <UsersScreen />
            </View>
        </SAV>
    );
}