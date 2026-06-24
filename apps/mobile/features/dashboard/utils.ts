import type { ActivityWithClient, DayCell, GridRow } from './types';

export function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
}

export function isWeekend(date: Date): boolean {
    const d = date.getDay();
    return d === 0 || d === 6;
}

export function toISODate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function buildGridRows(
    data: ActivityWithClient[],
    month: number,
    year: number
): GridRow[] {
    const today = new Date();
    const daysCount = getDaysInMonth(month, year);

    return data.map((client) => {
        const actMap = new Map<string, { id: string; daysWorked: number }>();
        for (const a of client.activities) {
            actMap.set(a.date.slice(0, 10), { id: a.id, daysWorked: a.daysWorked });
        }

        const cells: DayCell[] = [];
        let total = 0;

        for (let d = 1; d <= daysCount; d++) {
            const date = toISODate(year, month, d);
            const dayDate = new Date(year, month - 1, d);
            const act = actMap.get(date);
            const daysWorked = act?.daysWorked ?? 0;
            total += daysWorked;

            cells.push({
                day: d,
                date,
                activityId: act?.id ?? null,
                daysWorked,
                isWeekend: isWeekend(dayDate),
                isToday:
                    today.getDate() === d &&
                    today.getMonth() + 1 === month &&
                    today.getFullYear() === year,
            });
        }

        return { clientId: client.id, clientName: client.name, cells, total };
    });
}

const DAYS_SHORT = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
export function getDayLabel(year: number, month: number, day: number): string {
    return DAYS_SHORT[new Date(year, month - 1, day).getDay()];
}

export function formatDays(v: number): string {
    if (v === 0) return '';
    if (v === 1) return '1';
    return String(v);
}
