"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { PAGE_SIZE, getPageNumbers } from "./utils";

interface ActivityGridPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
}

export function ActivityGridPagination({
  page,
  totalPages,
  totalCount,
  isPending,
  onPageChange,
}: ActivityGridPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages} · {(page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, totalCount)} / {totalCount} clients
      </p>

      <div className="flex items-center gap-1 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={page === 1 || isPending}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isPending}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={() => onPageChange(p as number)}
              disabled={isPending}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isPending}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages || isPending}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
