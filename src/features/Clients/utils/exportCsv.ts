import type { Activity, Clients } from "@/generated/prisma_client";

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
  >[]
): void {
  const dailyRate = client.dailyRate ?? 0;

  const header = [
    "Date",
    "Days worked",
    "Hours worked",
    "Amount (EUR)",
    "Description",
    "Validated",
    "Rejected",
  ];

  const sorted = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const rows = sorted.map((a) => {
    const amount = (a.daysWorked ?? 0) * dailyRate;
    return [
      formatDateFr(a.date),
      formatNumberFr(a.daysWorked ?? 0),
      a.hoursWorked != null ? formatNumberFr(a.hoursWorked) : "",
      formatNumberFr(amount),
      a.description ?? "",
      a.validatedAt ? formatDateFr(a.validatedAt) : "",
      a.rejectedAt ? formatDateFr(a.rejectedAt) : "",
    ].map((cell) => escapeCsvCell(String(cell)));
  });

  const csvContent =
    "﻿" + // BOM so Excel detects UTF-8
    [header, ...rows]
      .map((line) => line.join(CSV_SEPARATOR))
      .join("\r\n");

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
