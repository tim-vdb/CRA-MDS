import type { getActivities } from "../../server/activity";

export type ActivityWithClient = Awaited<ReturnType<typeof getActivities>>[number];

export type DayEntry = {
  day: number;
  hours: number | null;
  activityId: string | null;
};

export type ClientRow = {
  clientId: string;
  clientName: string;
  days: DayEntry[];
  total: number;
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const PAGE_SIZE = 10;

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

export function buildRows(
  clients: ActivityWithClient[],
  year: number,
  month: number
): ClientRow[] {
  const totalDays = getDaysInMonth(year, month);

  return clients.map((client) => {
    const entryMap = new Map(
      client.activities.map((a) => [
        new Date(a.date).getDate(),
        { hours: a.hoursWorked ?? a.daysWorked, id: a.id },
      ])
    );

    const days: DayEntry[] = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      if (isWeekend(year, month, day)) return { day, hours: null, activityId: null };
      const entry = entryMap.get(day);
      return { day, hours: entry?.hours ?? null, activityId: entry?.id ?? null };
    });

    const total = days.reduce((sum, d) => sum + (d.hours ?? 0), 0);
    return { clientId: client.id, clientName: client.name, days, total };
  });
}

export function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}
