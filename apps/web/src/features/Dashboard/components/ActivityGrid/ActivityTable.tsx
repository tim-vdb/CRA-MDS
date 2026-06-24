"use client";

import Link from "next/link";
import { Badge } from "../../../../components/ui/badge";
import { cn } from "../../../../utils/utils";
import { ClientRow, isWeekend } from "./utils";
import { EditableDayInput } from "./EditableDayInput";

interface ActivityTableProps {
  paginated: ClientRow[];
  dayNumbers: number[];
  year: number;
  month: number;
  totalDays: number;
  isPending: boolean;
  editingCell: { clientId: string; day: number } | null;
  onCellClick: (clientId: string, day: number) => void;
  onCellSave: (clientId: string, day: number, value: string) => void;
  onCellBlur: () => void;
}

export function ActivityTable({
  paginated,
  dayNumbers,
  year,
  month,
  totalDays,
  isPending,
  editingCell,
  onCellClick,
  onCellSave,
  onCellBlur,
}: ActivityTableProps) {
  const today = new Date();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-opacity duration-200",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-20 bg-muted border-r border-border px-4 py-3 text-left font-semibold text-foreground min-w-[180px] whitespace-nowrap">
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
                      weekend ? "bg-muted/60 text-muted-foreground" : "text-muted-foreground",
                      isToday && "bg-primary/10 text-primary font-bold"
                    )}
                  >
                    {String(d).padStart(2, "0")}
                  </th>
                );
              })}
              <th className="sticky right-0 z-20 bg-muted border-l border-border px-4 py-3 text-center font-semibold text-foreground min-w-[72px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={totalDays + 2}
                  className="py-12 text-center text-muted-foreground text-sm"
                >
                  {isPending ? "Loading data…" : "No activity this month"}
                </td>
              </tr>
            ) : (
              paginated.map((row, rowIdx) => (
                <tr
                  key={row.clientId}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                    rowIdx % 2 === 1 && "bg-muted/20"
                  )}
                >
                  <td className="sticky left-0 z-10 bg-inherit border-r border-border px-4 py-2.5 font-medium whitespace-nowrap">
                    <Link
                      href={`/clients/${row.clientId}`}
                      className="text-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {row.clientName}
                    </Link>
                  </td>

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
                        onClick={() => onCellClick(row.clientId, d.day)}
                        className={cn(
                          "text-center py-2 px-0 min-w-12 relative transition-colors",
                          weekend
                            ? "bg-muted/40 cursor-default"
                            : "cursor-pointer hover:bg-primary/10",
                          isToday && !weekend && "bg-primary/5",
                          d.hours !== null && !weekend && "text-primary font-semibold"
                        )}
                      >
                        {isEditing ? (
                          <EditableDayInput
                            initialValue={d.hours}
                            onCommit={(value) => {
                              onCellSave(row.clientId, d.day, value);
                              onCellBlur();
                            }}
                            onCancel={onCellBlur}
                          />
                        ) : (
                          <span className="text-xs">
                            {d.hours !== null && !weekend ? d.hours : ""}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  <td className="sticky right-0 z-10 bg-inherit border-l border-border px-4 py-2.5 text-center">
                    {row.total > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 font-semibold text-xs"
                      >
                        {row.total % 1 === 0 ? row.total : row.total.toFixed(1)}j
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
