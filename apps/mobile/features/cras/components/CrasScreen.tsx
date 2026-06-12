import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MonthSelector } from '@/features/dashboard/components/MonthSelector';
import { useCras } from '../hooks';
import type { CraClient, CraSummary } from '../types';
 
function buildSummary(client: CraClient): CraSummary {
    const totalDays = client.activities.reduce((s, a) => s + a.daysWorked, 0);
    const totalBilledHT = client.activities.reduce(
        (s, a) => s + a.invoices.reduce((is, inv) => is + (inv.amountHT ?? 0), 0),
        0
    );
    const theoreticalBilled = totalDays * (client.dailyRate ?? 0);
    const gap = theoreticalBilled - totalBilledHT;
    const remainingDays = (client.maxDays ?? 0) - totalDays;
 
    return {
        clientId: client.id,
        clientName: client.name,
        dailyRate: client.dailyRate,
        maxDays: client.maxDays,
        totalDays,
        totalBilledHT,
        theoreticalBilled,
        gap,
        remainingDays,
    };
}
 
function fmt(n: number) {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}
 
function GapIcon({ gap }: { gap: number }) {
    if (gap > 0) return <TrendingDown size={14} color="#f97316" />;
    if (gap < 0) return <TrendingUp size={14} color="#ef4444" />;
    return <Minus size={14} color="#a1a1aa" />;
}
 
function SummaryRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <View className="flex-row items-center justify-between py-2">
            <Text className="text-sm text-muted-foreground">{label}</Text>
            <View className="items-end">
                <Text className="text-sm font-medium text-foreground">{value}</Text>
                {sub ? <Text className="text-xs text-muted-foreground">{sub}</Text> : null}
            </View>
        </View>
    );
}
 
function ClientCraCard({ summary }: { summary: CraSummary }) {
    const gapColor = summary.gap === 0 ? 'text-muted-foreground' : summary.gap > 0 ? 'text-orange-500' : 'text-destructive';
 
    return (
        <Card className="mb-3">
            <CardHeader className="pb-1">
                <View className="flex-row items-center justify-between">
                    <CardTitle>{summary.clientName}</CardTitle>
                    {summary.dailyRate != null && (
                        <Badge label={`${summary.dailyRate} €/j`} variant="secondary" />
                    )}
                </View>
            </CardHeader>
            <CardContent className="pt-0">
                <SummaryRow
                    label="Jours travaillés"
                    value={`${summary.totalDays.toFixed(1)} j`}
                    sub={summary.maxDays != null ? `/ ${summary.maxDays} j max` : undefined}
                />
                <Separator />
                <SummaryRow
                    label="Facturé"
                    value={fmt(summary.totalBilledHT)}
                />
                <Separator />
                <SummaryRow
                    label="Théorique"
                    value={fmt(summary.theoreticalBilled)}
                />
                <Separator />
                <View className="flex-row items-center justify-between py-2">
                    <Text className="text-sm text-muted-foreground">Écart</Text>
                    <View className="flex-row items-center gap-1.5">
                        <GapIcon gap={summary.gap} />
                        <Text className={`text-sm font-semibold ${gapColor}`}>
                            {summary.gap === 0 ? '—' : fmt(Math.abs(summary.gap))}
                        </Text>
                    </View>
                </View>
                {summary.maxDays != null && (
                    <>
                        <Separator />
                        <SummaryRow
                            label="Jours restants"
                            value={`${summary.remainingDays.toFixed(1)} j`}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
}
 
export default function CrasScreen() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const { data: clients = [], isLoading, error, refetch, isRefetching } = useCras(month, year);
 
    const summaries = clients.map(buildSummary);
    const totalDays = summaries.reduce((s, c) => s + c.totalDays, 0);
    const totalBilled = summaries.reduce((s, c) => s + c.totalBilledHT, 0);
    const totalTheoretical = summaries.reduce((s, c) => s + c.theoreticalBilled, 0);
 
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
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16, gap: 12 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        >
            {/* Month nav */}
            <View className="flex-row items-center justify-between">
                <Text className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Comptes-rendus
                </Text>
                <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
            </View>
 
            {/* Global summary card */}
            {summaries.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Récapitulatif</CardTitle></CardHeader>
                    <CardContent className="pt-0">
                        <SummaryRow label="Total jours" value={`${totalDays.toFixed(1)} j`} />
                        <Separator />
                        <SummaryRow label="Total facturé" value={fmt(totalBilled)} />
                        <Separator />
                        <SummaryRow label="Total théorique" value={fmt(totalTheoretical)} />
                        <Separator />
                        <View className="flex-row items-center justify-between py-2">
                            <Text className="text-sm font-semibold text-foreground">Écart global</Text>
                            <View className="flex-row items-center gap-1.5">
                                <GapIcon gap={totalTheoretical - totalBilled} />
                                <Text className={`text-sm font-bold ${
                                    totalTheoretical === totalBilled ? 'text-muted-foreground'
                                    : totalTheoretical > totalBilled ? 'text-orange-500' : 'text-destructive'
                                }`}>
                                    {totalTheoretical === totalBilled ? '—' : fmt(Math.abs(totalTheoretical - totalBilled))}
                                </Text>
                            </View>
                        </View>
                    </CardContent>
                </Card>
            )}
 
            {/* Per-client cards */}
            {summaries.length === 0 ? (
                <View className="mt-12 items-center">
                    <Text className="text-sm text-muted-foreground">Aucune activité ce mois-ci.</Text>
                </View>
            ) : (
                summaries.map((s) => <ClientCraCard key={s.clientId} summary={s} />)
            )}
 
            <View className="h-8" />
        </ScrollView>
    );
}