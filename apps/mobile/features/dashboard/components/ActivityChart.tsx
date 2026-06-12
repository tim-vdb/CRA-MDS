import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartEntry } from '../types';

type Props = { data: ChartEntry[]; month: number; year: number };

export function ActivityChart({ data, month, year }: Props) {
    // Aggregate daysWorked per calendar day
    const dayMap = new Map<number, number>();
    for (const e of data) {
        const d = new Date(e.date).getDate();
        dayMap.set(d, (dayMap.get(d) ?? 0) + e.daysWorked);
    }

    const barData = Array.from(dayMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([day, value]) => ({
            value,
            label: String(day),
            frontColor: value >= 1 ? '#18181b' : '#e4e4e7',
        }));

    if (barData.length === 0) {
        return (
            <Card>
                <CardHeader><CardTitle>Activité du mois</CardTitle></CardHeader>
                <CardContent>
                    <Text className="text-sm text-muted-foreground">Aucune activité ce mois-ci.</Text>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader><CardTitle>Activité du mois</CardTitle></CardHeader>
            <CardContent className="pt-0">
                <BarChart
                    data={barData}
                    barWidth={10}
                    barBorderRadius={3}
                    height={100}
                    maxValue={1}
                    noOfSections={4}
                    yAxisThickness={0}
                    xAxisThickness={1}
                    xAxisColor="#e4e4e7"
                    rulesColor="#f4f4f5"
                    labelWidth={16}
                    xAxisLabelTextStyle={{ fontSize: 9, color: '#a1a1aa' }}
                    yAxisTextStyle={{ fontSize: 9, color: '#a1a1aa' }}
                    hideYAxisText={false}
                    isAnimated
                />
            </CardContent>
        </Card>
    );
}
