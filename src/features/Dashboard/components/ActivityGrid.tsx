"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { ChevronLeft, ChevronRight, Search, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";
import { getActivities, upsertActivity } from "../server/activity";
import { useActivityRefresh } from "../context/ActivityRefreshContext";

type ActivityWithClient = Awaited<ReturnType<typeof getActivities>>[number];

type DayEntry = {
  day: number;
  hours: number | null;
  activityId: string | null;
};

type ClientRow = {
  clientId: string;
  clientName: string;
  days: DayEntry[];
  total: number;
};

type Props = {
  initialActivities: ActivityWithClient[];
  initialMonth: number;
  initialYear: number;
};

// ---------- Helpers ----------

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

// Transforme les activités Prisma en lignes de tableau
type ClientWithActivities = Awaited<ReturnType<typeof getActivities>>[number];

function buildRows(clients: ClientWithActivities[], year: number, month: number): ClientRow[] {
  const totalDays = getDaysInMonth(year, month);

  return clients.map((client) => {
    // Map jour → activité
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PAGE_SIZE = 10;

// ---------- Component ----------

export default function ActivityGrid({ initialActivities, initialMonth, initialYear }: Props) {
  const today = new Date();
  const { triggerRefresh } = useActivityRefresh();

  const [activities, setActivities] = useState<ActivityWithClient[]>(initialActivities);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingCell, setEditingCell] = useState<{ clientId: string; day: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Recharge les données quand le mois / l'année change
  useEffect(() => {
    startTransition(async () => {
      const fresh = await getActivities(month, year);
      setActivities(fresh);
      setPage(1);
    });
  }, [month, year]);

  const totalDays = getDaysInMonth(year, month);
  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1);

  const rows = useMemo(() => buildRows(activities, year, month), [activities, year, month]);

  const filtered = useMemo(
    () => rows.filter((r) => r.clientName.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Navigation mois
  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function handleCellClick(clientId: string, day: number) {
    if (isWeekend(year, month, day)) return;
    setEditingCell({ clientId, day });
  }

  function handleCellBlur() {
    setEditingCell(null);
  }

  async function handleCellSave(clientId: string, day: number, value: string) {
  const trimmedValue = value.trim();
  const parsed = trimmedValue === "" ? 0 : parseFloat(trimmedValue);
  if (isNaN(parsed)) return;

  const date = new Date(year, month - 1, day);
  await upsertActivity(clientId, date, parsed);

  const fresh = await getActivities(month, year);
  setActivities(fresh);
  
  triggerRefresh();
}

  function getPageNumbers(): (number | "...")[] {
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

  return (
    <div className="bg-gray-50 p-6 font-sans">
      <div className="max-w-full mx-auto space-y-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Activity Report
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  {filtered.length} client{filtered.length > 1 ? "s" : ""}
                  {search ? ` · filter: "${search}"` : ""}
                </>
              )}
            </p>
          </div>

          {/* Sélecteur de mois */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={prevMonth}
              disabled={isPending}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[160px] justify-center">
              <Select
                value={String(month)}
                onValueChange={(v) => { setMonth(Number(v)); setPage(1); }}
                disabled={isPending}
              >
                <SelectTrigger className="h-7 border-0 shadow-none font-medium text-gray-800 w-[110px] focus:ring-0 p-0 pl-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(year)}
                onValueChange={(v) => { setYear(Number(v)); setPage(1); }}
                disabled={isPending}
              >
                <SelectTrigger className="h-7 border-0 shadow-none font-medium text-gray-500 w-[60px] focus:ring-0 p-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i).map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={nextMonth}
              disabled={isPending}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search a client…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200 h-9 text-sm"
          />
        </div>

        {/* Tableau */}
        <div
          className={cn(
            "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-opacity duration-200",
            isPending && "opacity-50 pointer-events-none"
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="sticky left-0 z-20 bg-gray-50 border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 min-w-[180px] whitespace-nowrap">
                    Label
                  </th>
                  {dayNumbers.map((d) => {
                    const weekend = isWeekend(year, month, d);
                    const isToday =
                      d === today.getDate() &&
                      month === today.getMonth() + 1 &&
                      year === today.getFullYear();
                    return (
                      <th
                        key={d}
                        className={cn(
                          "min-w-[36px] w-[36px] text-center py-3 font-medium text-xs",
                          weekend ? "bg-gray-100 text-gray-400" : "text-gray-500",
                          isToday && "bg-blue-50 text-blue-600 font-bold"
                        )}
                      >
                        {String(d).padStart(2, "0")}
                      </th>
                    );
                  })}
                  <th className="sticky right-0 z-20 bg-gray-50 border-l border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 min-w-[72px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={totalDays + 2}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      {isPending ? "Loading data…" : "No activity this month"}
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, rowIdx) => (
                    <tr
                      key={row.clientId}
                      className={cn(
                        "border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors",
                        rowIdx % 2 === 1 && "bg-gray-50/40"
                      )}
                    >
                      {/* Nom client */}
                      <td className="sticky left-0 z-10 bg-inherit border-r border-gray-100 px-4 py-2.5 font-medium text-gray-800 whitespace-nowrap">
                        {row.clientName}
                      </td>

                      {/* Cellules jours */}
                      {row.days.map((d) => {
                        const weekend = isWeekend(year, month, d.day);
                        const isEditing =
                          editingCell?.clientId === row.clientId &&
                          editingCell?.day === d.day;
                        const isToday =
                          d.day === today.getDate() &&
                          month === today.getMonth() + 1 &&
                          year === today.getFullYear();

                        return (
                          <td
                            key={d.day}
                            onClick={() => handleCellClick(row.clientId, d.day)}
                            className={cn(
                              "text-center py-2 px-0 relative transition-colors",
                              weekend
                                ? "bg-gray-100/70 cursor-default"
                                : "cursor-pointer hover:bg-blue-50",
                              isToday && !weekend && "bg-blue-50/60",
                              d.hours !== null && !weekend && "text-blue-700 font-semibold"
                            )}
                          >
                            {isEditing ? (
                              <input
                                autoFocus
                                type="number"
                                step="0.5"
                                min="0"
                                max="2"
                                defaultValue={d.hours ?? ""}
                                onBlur={(e) => {
                                handleCellSave(row.clientId, d.day, e.target.value);
                                handleCellBlur();
                                }}
                                className="w-full text-center bg-blue-100 text-blue-800 text-xs font-bold outline-none border-0 py-1.5"
                              />
                            ) : (
                              <span className="text-xs">
                                {d.hours !== null && !weekend ? d.hours : ""}
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total */}
                      <td className="sticky right-0 z-10 bg-inherit border-l border-gray-100 px-4 py-2.5 text-center">
                        {row.total > 0 ? (
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-100 font-semibold text-xs"
                          >
                            {row.total % 1 === 0 ? row.total : row.total.toFixed(1)}j
                          </Badge>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} ·{" "}
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} /{" "}
              {filtered.length} clients
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPage(1)}
                disabled={page === 1 || isPending}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isPending}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 text-xs",
                      page === p && "bg-blue-600 hover:bg-blue-700 border-blue-600"
                    )}
                    onClick={() => setPage(p as number)}
                    disabled={isPending}
                  >
                    {p}
                  </Button>
                )
              )}

              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPending}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || isPending}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-200" />
            Weekend
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-100" />
            Today
          </div>
          <div className="flex items-center gap-1.5 italic">
            Click a cell to edit
          </div>
        </div>
      </div>
    </div>
  );
}
