export type Activity = {
    id: string;
    date: string;
    daysWorked: number;
    hoursWorked: number | null;
};

export type ActivityWithClient = {
    id: string;
    name: string;
    activities: Activity[];
};

export type ChartEntry = {
    date: string;
    daysWorked: number;
};

export type DayCell = {
    day: number;        // 1-31
    date: string;       // ISO yyyy-MM-dd
    activityId: string | null;
    daysWorked: number; // 0 if no record
    isWeekend: boolean;
    isToday: boolean;
};

export type GridRow = {
    clientId: string;
    clientName: string;
    cells: DayCell[];
    total: number;
};
