import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Button } from '@/components/ui/button';
import { MonthSelector } from './MonthSelector';
import { StatsCards } from './StatsCards';
import { ActivityChart } from './ActivityChart';
import { ActivityGrid } from './ActivityGrid';
import { useActivities, useChartData } from '../hooks';
import { buildGridRows, getDaysInMonth } from '../utils';

export default function DashboardScreen() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const activities = useActivities(month, year);
    const chart = useChartData(month, year);

    const rows = buildGridRows(activities.data ?? [], month, year);
    const daysInMonth = getDaysInMonth(month, year);
    const isRefetching = activities.isRefetching || chart.isRefetching;

    function refetch() {
        activities.refetch();
        chart.refetch();
    }

    function handleMonthChange(m: number, y: number) {
        setMonth(m);
        setYear(y);
    }

    if (activities.isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (activities.error) {
        return (
            <View className="flex-1 items-center justify-center gap-4 px-8">
                <Text className="text-center text-sm text-destructive">
                    {activities.error instanceof Error ? activities.error.message : 'Erreur inconnue'}
                </Text>
                <Button label="Réessayer" variant="outline" onPress={refetch} />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, gap: 12 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
            {/* Month navigation */}
            <View className="flex-row items-center justify-between">
                <Text className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Activités
                </Text>
                <MonthSelector month={month} year={year} onChange={handleMonthChange} />
            </View>

            {/* Stats */}
            <StatsCards rows={rows} />

            {/* Chart */}
            {chart.data && chart.data.length > 0 && (
                <ActivityChart data={chart.data} month={month} year={year} />
            )}

            {/* Grid */}
            {rows.length === 0 ? (
                <View className="items-center py-12">
                    <Text className="text-sm text-muted-foreground">
                        Aucun client actif ce mois-ci.
                    </Text>
                </View>
            ) : (
                <>
                    <Text className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Grille d'activité
                    </Text>
                    <ActivityGrid
                        rows={rows}
                        month={month}
                        year={year}
                        daysInMonth={daysInMonth}
                    />
                </>
            )}

            <View className="h-8" />
        </ScrollView>
    );
}
