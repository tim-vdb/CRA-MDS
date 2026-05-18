"use client";

import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import type { Activity, Invoice } from "@/generated/prisma_client";
import { cn } from "@/utils/utils";

type CRAWithInvoices = Activity & { invoices: Invoice[] };

interface SummaryTableProps {
    cras: CRAWithInvoices[];
    dailyRate: number;
    maxDays: number;
    maxBudget: number;
    editedCras: Record<string, { daysWorked: string }>;
    editedBilled: Record<string, string>;
}

export default function SummaryTable({
    cras,
    dailyRate,
    maxDays,
    maxBudget,
    editedCras,
    editedBilled,
}: SummaryTableProps) {

    function fmtEur(value: number, signed = false) {
        const formatted =
            value.toLocaleString("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }) + " €";
        return signed && value > 0 ? `+${formatted}` : formatted;
    }

    function fmtDays(value: number, signed = false) {
        const formatted =
            value.toLocaleString("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }) + " j";
        return signed && value > 0 ? `+${formatted}` : formatted;
    }

    function EcartValue({
        value,
        unit = "€",
    }: {
        value: number;
        unit?: "€" | "j";
    }) {
        if (value === 0) {
            return (
                <span className="text-muted-foreground tabular-nums">
                    {unit === "€" ? fmtEur(0) : fmtDays(0)}
                </span>
            );
        }
        const text = unit === "€" ? fmtEur(value, true) : fmtDays(value, true);
        return (
            <span
                className={cn(
                    "tabular-nums font-medium",
                    value > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-red-600 dark:text-red-400"
                )}
            >
                {text}
            </span>
        );
    }

    // Calculate totals using edited values
    const totalDays = Object.values(editedCras).reduce(
        (sum, edit) => sum + parseFloat(edit.daysWorked || "0"),
        0
    );

    const totalTheorique = totalDays * dailyRate;
    const totalEffectif = Object.values(editedBilled).reduce(
        (sum, v) => sum + (parseFloat(v) || 0),
        0
    );

    const ecartThMaxEur = totalTheorique - maxBudget;
    const ecartThMaxDays = totalDays - maxDays;
    const ecartEffThEur = totalEffectif - totalTheorique;
    const ecartEffThDays = dailyRate > 0 ? ecartEffThEur / dailyRate : 0;

    const resteAFacturerEur = totalTheorique - totalEffectif;
    const resteAFacturerDays = dailyRate > 0 ? resteAFacturerEur / dailyRate : 0;

    const resteAConsommerDays = Math.max(0, maxDays - totalDays);
    const resteAConsommerEur = Math.max(0, maxBudget - totalTheorique);

    const totalFinalDays = maxDays > 0 ? Math.max(totalDays, maxDays) : totalDays;
    const totalFinalEur =
        maxBudget > 0 ? Math.max(totalTheorique, maxBudget) : totalTheorique;

    return (
        <Card className="overflow-hidden">
            <Table>
                {cras.length > 0 && (
                    <TableBody className="bg-muted/20">
                        {/* Total gap € */}
                        <TableRow className="border-t-2">
                            <TableCell colSpan={5} className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2">
                                Total gap €
                            </TableCell>
                            <TableCell className="text-right py-2">
                                <EcartValue value={ecartThMaxEur} />
                            </TableCell>
                            <TableCell className="text-right py-2">
                                <EcartValue value={ecartEffThEur} />
                            </TableCell>
                        </TableRow>

                        {/* Total gap days */}
                        <TableRow>
                            <TableCell colSpan={5} className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2">
                                Total gap days
                            </TableCell>
                            <TableCell className="text-right py-2">
                                <EcartValue value={ecartThMaxDays} unit="j" />
                            </TableCell>
                            <TableCell className="text-right py-2">
                                <EcartValue value={ecartEffThDays} unit="j" />
                            </TableCell>
                        </TableRow>

                        {/* Facturation block */}
                        <TableRow className="border-t">
                            <TableCell colSpan={3} className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2">
                                Billed
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-semibold py-2">
                                {fmtEur(totalEffectif)}
                            </TableCell>
                            <TableCell colSpan={3} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2">
                                Remaining to bill
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-medium py-2">
                                {dailyRate > 0 ? fmtDays(resteAFacturerDays) : "—"}
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-semibold py-2">
                                {fmtEur(resteAFacturerEur)}
                            </TableCell>
                            <TableCell colSpan={3} />
                        </TableRow>

                        {/* Consommation block */}
                        <TableRow className="border-t">
                            <TableCell className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2">
                                Consumed
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-semibold py-2">
                                {fmtDays(totalDays)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-semibold py-2">
                                {dailyRate > 0 ? fmtEur(totalTheorique) : "—"}
                            </TableCell>
                            <TableCell colSpan={4} />
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2">
                                Remaining to consume
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-medium py-2">
                                {maxDays > 0 ? fmtDays(resteAConsommerDays) : "—"}
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-medium py-2">
                                {maxBudget > 0 ? fmtEur(resteAConsommerEur) : "—"}
                            </TableCell>
                            <TableCell colSpan={4} />
                        </TableRow>

                        {/* Total */}
                        <TableRow className="border-t-2 bg-muted/40">
                            <TableCell className="text-sm uppercase tracking-wide font-bold py-3">
                                Total
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-bold py-3">
                                {fmtDays(totalFinalDays)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums font-bold py-3">
                                {dailyRate > 0 ? fmtEur(totalFinalEur) : "—"}
                            </TableCell>
                            <TableCell colSpan={4} />
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </Card>
    );
}
