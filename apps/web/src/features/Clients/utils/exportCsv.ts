import type { Activity, Clients } from "../../../generated/prisma_client";
import dayjs from "dayjs";

const CSV_SEPARATOR = ";";

function escapeCsvCell(value: string): string {
  if (value.includes(CSV_SEPARATOR) || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDateFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR");
}

function formatNumberFr(n: number): string {
  return n.toString().replace(".", ",");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function exportClientActivitiesToCsv(
  client: Pick<Clients, "name" | "dailyRate">,
  activities: Pick<
    Activity,
    | "date"
    | "daysWorked"
    | "hoursWorked"
    | "description"
    | "validatedAt"
    | "rejectedAt"
  >[],
  editedBilled: Record<string, string> = {}
): void {
  const dailyRate = client.dailyRate ?? 0;

  const sorted = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group rows by month to inject "Actual billed" subtotal per month
  const monthMap = new Map<string, typeof sorted>();
  for (const a of sorted) {
    const key = dayjs(a.date).format("YYYY-MM");
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key)!.push(a);
  }

  const header = [
    "Date",
    "Days worked",
    "Hours worked",
    "Theoretical amount (EUR)",
    "Description",
    "Validated",
    "Rejected",
    "Actual billed (EUR)",
  ].map((h) => escapeCsvCell(h));

  const lines: string[][] = [header];

  for (const [monthKey, monthActivities] of monthMap) {
    const actualBilled = parseFloat(editedBilled[monthKey] ?? "0") || 0;
    const monthLabel = dayjs(monthKey, "YYYY-MM").format("MMMM YYYY");

    // Separator row for the month
    lines.push(
      [monthLabel, "", "", "", "", "", "", ""].map((c) => escapeCsvCell(c))
    );

    for (const a of monthActivities) {
      const amount = (a.daysWorked ?? 0) * dailyRate;
      lines.push(
        [
          formatDateFr(a.date),
          formatNumberFr(a.daysWorked ?? 0),
          a.hoursWorked != null ? formatNumberFr(a.hoursWorked) : "",
          formatNumberFr(amount),
          a.description ?? "",
          a.validatedAt ? formatDateFr(a.validatedAt) : "",
          a.rejectedAt ? formatDateFr(a.rejectedAt) : "",
          "",
        ].map((c) => escapeCsvCell(String(c)))
      );
    }

    // Subtotal row per month with actual billed
    const monthDays = monthActivities.reduce((s, a) => s + (a.daysWorked ?? 0), 0);
    const monthTheoretical = monthDays * dailyRate;
    lines.push(
      [
        `Subtotal ${monthLabel}`,
        formatNumberFr(monthDays),
        "",
        formatNumberFr(monthTheoretical),
        "",
        "",
        "",
        formatNumberFr(actualBilled),
      ].map((c) => escapeCsvCell(c))
    );

    lines.push(["", "", "", "", "", "", "", ""]); // blank separator
  }

  // Grand total row
  const totalDays = sorted.reduce((s, a) => s + (a.daysWorked ?? 0), 0);
  const totalTheoretical = totalDays * dailyRate;
  const totalBilled = Object.values(editedBilled).reduce(
    (s, v) => s + (parseFloat(v) || 0),
    0
  );
  lines.push(
    [
      "TOTAL",
      formatNumberFr(totalDays),
      "",
      formatNumberFr(totalTheoretical),
      "",
      "",
      "",
      formatNumberFr(totalBilled),
    ].map((c) => escapeCsvCell(c))
  );

  const csvContent =
    "﻿" + // BOM UTF-8 pour Excel
    lines.map((line) => line.join(CSV_SEPARATOR)).join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10);
  const filename = `cra-${slugify(client.name) || "client"}-${today}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
