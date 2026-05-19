"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { MONTHS } from "./utils";

interface MonthSelectorProps {
  month: number;
  year: number;
  isPending: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function MonthSelector({
  month,
  year,
  isPending,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
}: MonthSelectorProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onPrevMonth}
        disabled={isPending}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 min-w-40 justify-center">
        <Select
          value={String(month)}
          onValueChange={(v) => onMonthChange(Number(v))}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 border-0 shadow-none font-medium text-foreground w-[110px] focus:ring-0 p-0 pl-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(year)}
          onValueChange={(v) => onYearChange(Number(v))}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 border-0 shadow-none font-medium text-muted-foreground w-[60px] focus:ring-0 p-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onNextMonth}
        disabled={isPending}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
