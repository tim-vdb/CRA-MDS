import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import type { GridRow } from '../types';

type Props = { rows: GridRow[] };

export function StatsCards({ rows }: Props) {
    const totalDays = rows.reduce((s, r) => s + r.total, 0);
    const activeDays = rows.reduce((s, r) => s + r.cells.filter((c) => c.daysWorked > 0).length, 0);
    const activeClients = rows.filter((r) => r.total > 0).length;

    const stats = [
        { label: 'Jours totaux', value: totalDays.toFixed(1) },
        { label: 'Entrées actives', value: String(activeDays) },
        { label: 'Clients actifs', value: String(activeClients) },
    ];

    return (
        <View className="flex-row gap-2">
            {stats.map((s) => (
                <Card key={s.label} className="flex-1">
                    <CardContent className="items-center p-3">
                        <Text className="text-xl font-bold text-foreground">{s.value}</Text>
                        <Text className="text-center text-xs text-muted-foreground">{s.label}</Text>
                    </CardContent>
                </Card>
            ))}
        </View>
    );
}
