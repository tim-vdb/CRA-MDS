import { useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Modal,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GridRow, DayCell } from '../types';
import { getDayLabel, formatDays } from '../utils';
import { useUpsertActivity } from '../hooks';

const COL_W = 36;
const CLIENT_W = 120;
const ROW_H = 40;

type CellEditState = { clientId: string; cell: DayCell } | null;

function DayHeader({ day, month, year }: { day: number; month: number; year: number }) {
    const label = getDayLabel(year, month, day);
    const date = new Date(year, month - 1, day);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() + 1 === month &&
        new Date().getFullYear() === year;

    return (
        <View
            style={{ width: COL_W, height: ROW_H }}
            className={`items-center justify-center border-b border-border ${weekend ? 'bg-secondary/50' : 'bg-background'} ${isToday ? 'bg-primary/10' : ''}`}
        >
            <Text className={`text-[10px] font-medium ${weekend ? 'text-muted-foreground/50' : 'text-muted-foreground'} ${isToday ? 'text-primary font-bold' : ''}`}>
                {label}
            </Text>
            <Text className={`text-[11px] font-semibold ${weekend ? 'text-muted-foreground/50' : 'text-foreground'} ${isToday ? 'text-primary' : ''}`}>
                {day}
            </Text>
        </View>
    );
}

function DayCell_({ cell, onPress }: { cell: DayCell; onPress: () => void }) {
    const hasValue = cell.daysWorked > 0;
    return (
        <Pressable
            onPress={cell.isWeekend ? undefined : onPress}
            style={{ width: COL_W, height: ROW_H }}
            className={`items-center justify-center border-b border-r border-border/40 active:bg-accent/60
                ${cell.isWeekend ? 'bg-secondary/30' : 'bg-background'}
                ${cell.isToday ? 'bg-primary/5' : ''}
                ${hasValue ? 'bg-primary/10' : ''}`}
        >
            {hasValue ? (
                <Text className={`text-xs font-semibold text-primary`}>
                    {formatDays(cell.daysWorked)}
                </Text>
            ) : null}
        </Pressable>
    );
}

type EditModalProps = {
    state: CellEditState;
    month: number;
    year: number;
    onClose: () => void;
};

function EditModal({ state, month, year, onClose }: EditModalProps) {
    const [value, setValue] = useState(
        state ? (state.cell.daysWorked > 0 ? String(state.cell.daysWorked) : '') : ''
    );
    const upsert = useUpsertActivity(month, year);

    if (!state) return null;

    const QUICK = [0, 0.25, 0.5, 0.75, 1];

    function save(v: number) {
        upsert.mutate(
            { clientId: state!.clientId, date: state!.cell.date, daysWorked: v },
            {
                onSuccess: onClose,
                onError: (e) => Alert.alert('Erreur', e instanceof Error ? e.message : 'inconnue'),
            }
        );
    }

    return (
        <Modal visible animationType="fade" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 items-center justify-center bg-black/40"
            >
                <View className="w-72 rounded-xl bg-background p-5 shadow-lg">
                    <Text className="mb-1 text-sm font-semibold text-foreground">
                        {state.cell.date}
                    </Text>
                    <Text className="mb-4 text-xs text-muted-foreground">{state.clientId}</Text>

                    {/* Quick buttons */}
                    <View className="mb-4 flex-row gap-2">
                        {QUICK.map((v) => (
                            <Pressable
                                key={v}
                                onPress={() => save(v)}
                                className={`flex-1 items-center rounded-md py-2 border active:opacity-70
                                    ${state.cell.daysWorked === v ? 'bg-primary border-primary' : 'border-border bg-secondary'}`}
                            >
                                <Text className={`text-xs font-medium ${state.cell.daysWorked === v ? 'text-primary-foreground' : 'text-foreground'}`}>
                                    {v === 0 ? '—' : v}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="flex-row gap-2">
                        <Button label="Annuler" variant="outline" onPress={onClose} className="flex-1" />
                        <Button
                            label="OK"
                            loading={upsert.isPending}
                            onPress={() => {
                                const n = parseFloat(value.replace(',', '.'));
                                save(isNaN(n) ? 0 : Math.min(1, Math.max(0, n)));
                            }}
                            className="flex-1"
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

type Props = { rows: GridRow[]; month: number; year: number; daysInMonth: number };

export function ActivityGrid({ rows, month, year, daysInMonth }: Props) {
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const [editing, setEditing] = useState<CellEditState>(null);
    const hScrollRef = useRef<ScrollView>(null);

    return (
        <Card className="overflow-hidden">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={hScrollRef}>
                <View>
                    {/* Header row */}
                    <View className="flex-row border-b border-border">
                        <View
                            style={{ width: CLIENT_W, height: ROW_H }}
                            className="items-center justify-center border-r border-border bg-secondary/50"
                        >
                            <Text className="text-xs font-semibold text-muted-foreground">Client</Text>
                        </View>
                        {days.map((d) => (
                            <DayHeader key={d} day={d} month={month} year={year} />
                        ))}
                        <View
                            style={{ width: COL_W, height: ROW_H }}
                            className="items-center justify-center border-l border-border bg-secondary/50"
                        >
                            <Text className="text-[10px] font-semibold text-muted-foreground">Tot.</Text>
                        </View>
                    </View>

                    {/* Data rows */}
                    {rows.map((row) => (
                        <View key={row.clientId} className="flex-row">
                            <View
                                style={{ width: CLIENT_W, height: ROW_H }}
                                className="items-start justify-center border-b border-r border-border px-2"
                            >
                                <Text className="text-xs font-medium text-foreground" numberOfLines={1}>
                                    {row.clientName}
                                </Text>
                            </View>
                            {row.cells.map((cell) => (
                                <DayCell_
                                    key={cell.day}
                                    cell={cell}
                                    onPress={() => setEditing({ clientId: row.clientId, cell })}
                                />
                            ))}
                            <View
                                style={{ width: COL_W, height: ROW_H }}
                                className="items-center justify-center border-b border-l border-border bg-secondary/30"
                            >
                                <Text className="text-xs font-semibold text-foreground">
                                    {row.total > 0 ? row.total.toFixed(1) : ''}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <EditModal state={editing} month={month} year={year} onClose={() => setEditing(null)} />
        </Card>
    );
}
