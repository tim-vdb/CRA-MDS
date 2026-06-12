import { View, Text } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import AccountScreen from '@/features/account/components/AccountScreen';
 
const SAV = SafeAreaViewContext as any;
 
export default function AccountPage() {
    return (
        <SAV edges={['top']} style={{ flex: 1 }} className="bg-background">
            <View className="flex-1 bg-background">
                <Text className="px-4 pb-2 pt-1 text-2xl font-bold text-foreground">Compte</Text>
                <AccountScreen />
            </View>
        </SAV>
    );
}