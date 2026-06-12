import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

type Props = {
    month: number; // 1-12
    year: number;
    onChange: (month: number, year: number) => void;
};

export function MonthSelector({ month, year, onChange }: Props) {
    function prev() {
        if (month === 1) onChange(12, year - 1);
        else onChange(month - 1, year);
    }
    function next() {
        if (month === 12) onChange(1, year + 1);
        else onChange(month + 1, year);
    }

    return (
        <View className="flex-row items-center gap-2">
            <Pressable onPress={prev} className="rounded-md p-1.5 active:bg-muted">
                <ChevronLeft size={18} color="#3f3f46" />
            </Pressable>
            <Text className="min-w-[100px] text-center text-sm font-semibold text-foreground">
                {MONTHS[month - 1]} {year}
            </Text>
            <Pressable onPress={next} className="rounded-md p-1.5 active:bg-muted">
                <ChevronRight size={18} color="#3f3f46" />
            </Pressable>
        </View>
    );
}
