"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getActivities, upsertActivity } from "../../server/activity";
import { useActivityRefresh } from "../../context/ActivityRefreshContext";
import {
  ActivityWithClient,
  buildRows,
  getDaysInMonth,
  isWeekend,
  PAGE_SIZE,
} from "./utils";
import { MonthSelector } from "./MonthSelector";
import { ActivityTable } from "./ActivityTable";
import { ActivityGridPagination } from "./ActivityGridPagination";

type Props = {
  initialActivities: ActivityWithClient[];
  initialMonth: number;
  initialYear: number;
};

export default function ActivityGrid({ initialActivities, initialMonth, initialYear }: Props) {
  const { triggerRefresh } = useActivityRefresh();

  const [activities, setActivities] = useState<ActivityWithClient[]>(initialActivities);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingCell, setEditingCell] = useState<{ clientId: string; day: number } | null>(null);
  const [isPending, startTransition] = useTransition();

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

  async function handleCellSave(clientId: string, day: number, value: string) {
    const trimmed = value.trim();
    const parsed = trimmed === "" ? 0 : parseFloat(trimmed);
    if (isNaN(parsed) || parsed < 0 || parsed > 1) return;

    const date = new Date(year, month - 1, day);
    await upsertActivity(clientId, date, parsed);

    const fresh = await getActivities(month, year);
    setActivities(fresh);
    triggerRefresh();
  }

  return (
    <div className="bg-muted/30 p-3 sm:p-6 font-sans rounded-xl">
      <div className="max-w-full mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Activity Report
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
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

          <MonthSelector
            month={month}
            year={year}
            isPending={isPending}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onMonthChange={(m) => { setMonth(m); setPage(1); }}
            onYearChange={(y) => { setYear(y); setPage(1); }}
          />
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search a client…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <ActivityTable
          paginated={paginated}
          dayNumbers={dayNumbers}
          year={year}
          month={month}
          totalDays={totalDays}
          isPending={isPending}
          editingCell={editingCell}
          onCellClick={handleCellClick}
          onCellSave={handleCellSave}
          onCellBlur={() => setEditingCell(null)}
        />

        <ActivityGridPagination
          page={page}
          totalPages={totalPages}
          totalCount={filtered.length}
          isPending={isPending}
          onPageChange={setPage}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted-foreground/30 border border-muted-foreground/40" />
            Weekend
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/50" />
            Today
          </div>
          <p className="italic w-full sm:w-auto">
            <span className="sm:hidden">Swipe to see all days.</span>
            <span className="hidden sm:inline">
              Click a cell to edit · Click a client name to open
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
