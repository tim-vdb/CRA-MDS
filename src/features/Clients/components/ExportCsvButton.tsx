"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Activity, Clients } from "@/generated/prisma_client";
import { exportClientActivitiesToCsv } from "../utils/exportCsv";

interface ExportCsvButtonProps {
  client: Pick<Clients, "name" | "dailyRate">;
  activities: Pick<
    Activity,
    | "date"
    | "daysWorked"
    | "hoursWorked"
    | "description"
    | "validatedAt"
    | "rejectedAt"
  >[];
}

export function ExportCsvButton({ client, activities }: ExportCsvButtonProps) {
  const disabled = activities.length === 0;

  function handleClick() {
    try {
      exportClientActivitiesToCsv(client, activities);
      toast.success(`Exported ${activities.length} activity entries`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not export CSV"
      );
    }
  }

  const button = (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      <Download className="h-3.5 w-3.5 mr-1.5" />
      Export CSV
    </Button>
  );

  if (!disabled) return button;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* span needed so tooltip works on disabled button */}
          <span tabIndex={0}>{button}</span>
        </TooltipTrigger>
        <TooltipContent>No activities to export</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
