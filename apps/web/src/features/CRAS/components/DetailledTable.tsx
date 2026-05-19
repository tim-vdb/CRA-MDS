"use client";

import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Save, RotateCcw, FileText, Info } from "lucide-react";
import type { Activity, Invoice } from "../../../generated/prisma_client";
import { cn } from "../../../utils/utils";
import { useState } from "react";
import { toast } from "sonner";
import { updateCras } from "../server/updateCras";

dayjs.locale("fr");

type CRAWithInvoices = Activity & { invoices: Invoice[] };

interface MonthData {
    monthYear: string;
    month: number;
    year: number;
    cras: CRAWithInvoices[];
    totalDaysInMonth: number;
    totalFactureEffectif: number;
}

interface DetailledTableProps {
    cras: CRAWithInvoices[];
    dailyRate: number;
    maxDays: number;
    maxBudget: number;
    editedCras: Record<string, { daysWorked: string }>;
    setEditedCras: React.Dispatch<
        React.SetStateAction<Record<string, { daysWorked: string }>>
    >;
    editedBilled: Record<string, string>;
    setEditedBilled: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function DetailledTable({
    cras,
    dailyRate,
    maxDays,
    maxBudget,
    editedCras,
    setEditedCras,
    editedBilled,
    setEditedBilled,
}: DetailledTableProps) {
    const [isModified, setIsModified] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const groupByMonth = (): MonthData[] => {
        const monthMap = new Map<string, CRAWithInvoices[]>();

        cras.forEach((cra) => {
            const date = dayjs(cra.date);
            const key = date.format("YYYY-MM");
            if (!monthMap.has(key)) {
                monthMap.set(key, []);
            }
            monthMap.get(key)!.push(cra);
        });

        return Array.from(monthMap.entries())
            .map(([key, craList]) => {
                const date = dayjs(key, "YYYY-MM");
                const monthYear = date.format("MMMM YYYY");
                const month = date.month();
                const year = date.year();

                const totalDaysInMonth = craList.reduce((sum, cra) => {
                    const daysWorked = parseFloat(
                        editedCras[cra.id]?.daysWorked || cra.daysWorked.toString()
                    );
                    return sum + daysWorked;
                }, 0);

                const totalFactureEffectif = craList.reduce((sum, cra) => {
                    return sum + cra.invoices.reduce((s, inv) => s + inv.amountHT, 0);
                }, 0);

                return {
                    monthYear,
                    month,
                    year,
                    cras: craList,
                    totalDaysInMonth,
                    totalFactureEffectif,
                };
            })
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.month - b.month;
            });
    };

    const monthData = groupByMonth();

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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateCras(editedCras);
            if (result.success) {
                toast.success(result.message);
                setIsModified(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred while saving");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setEditedCras(
            cras.reduce((acc, cra) => {
                acc[cra.id] = { daysWorked: cra.daysWorked.toString() };
                return acc;
            }, {} as Record<string, { daysWorked: string }>)
        );
        setIsModified(false);
    };


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

    function HeaderInfo({ children }: { children: React.ReactNode }) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center cursor-help text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                        <Info className="h-3 w-3" />
                    </span>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-xs bg-foreground text-background"
                >
                    <div className="space-y-1.5 text-xs leading-relaxed py-1">
                        {children}
                    </div>
                </TooltipContent>
            </Tooltip>
        );
    }


    return (
        <Card className="overflow-hidden">
            <div className="border-b bg-muted/30 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Daily rate
                            </span>
                            <span className="font-semibold tabular-nums">
                                {dailyRate > 0 ? fmtEur(dailyRate) : "—"}
                            </span>
                        </div>
                        {maxDays > 0 && (
                            <>
                                <span className="text-muted-foreground/30">|</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        Cap
                                    </span>
                                    <span className="font-semibold tabular-nums">
                                        {fmtDays(maxDays)}
                                        <span className="text-muted-foreground font-normal">
                                            {" "}({fmtEur(maxBudget)})
                                        </span>
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {isModified && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleReset}
                                disabled={isSaving}
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                <Save className="h-3.5 w-3.5 mr-1.5" />
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-40">Period</TableHead>
                        <TableHead className="text-right w-32">Days</TableHead>
                        <TableHead className="text-right">Theoretical billed</TableHead>
                        <TableHead className="text-right">Actual billed</TableHead>
                        <TableHead className="text-right">Theoretical max</TableHead>
                        <TableHead className="text-right">
                            <span className="inline-flex items-center justify-end gap-1.5">
                                Theoretical vs max gap
                                <HeaderInfo>
                                    <p className="font-semibold text-[11px] uppercase tracking-wide opacity-70">
                                        Comparison vs contract cap
                                    </p>
                                    <p>
                                        <span className="text-orange-300 font-semibold">Positive</span> :
                                        too many days worked, exceeds the allocated budget.
                                    </p>
                                    <p>
                                        <span className="text-red-300 font-semibold">Negative</span> :
                                        remaining days to reach the cap.
                                    </p>
                                </HeaderInfo>
                            </span>
                        </TableHead>
                        <TableHead className="text-right">
                            <span className="inline-flex items-center justify-end gap-1.5">
                                Actual vs theoretical gap
                                <HeaderInfo>
                                    <p className="font-semibold text-[11px] uppercase tracking-wide opacity-70">
                                        Comparison billed vs work done
                                    </p>
                                    <p>
                                        <span className="text-orange-300 font-semibold">Positive</span> :
                                        billing advance.
                                    </p>
                                    <p>
                                        <span className="text-red-300 font-semibold">Negative</span> :
                                        billing behind.
                                    </p>
                                </HeaderInfo>
                            </span>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {monthData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-14">
                                <FileText className="h-8 w-8 mx-auto mb-2.5 opacity-25" />
                                <p className="text-sm font-medium">No activity reports</p>
                                <p className="text-xs mt-0.5 opacity-70">
                                    Activity reports will appear here
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        monthData.map((month) => {
                            const monthKey = `${month.year}-${String(month.month + 1).padStart(2, "0")}`;
                            const billedRaw = editedBilled[monthKey] ?? "0";
                            const billedValue = parseFloat(billedRaw) || 0;

                            const factureTheorique = month.totalDaysInMonth * dailyRate;
                            const ecartThMax = factureTheorique;
                            const ecartEffTh = billedValue - factureTheorique;

                            return (
                                <TableRow key={monthKey} className="hover:bg-muted/30">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                                            <span>{month.monthYear}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {fmtDays(month.totalDaysInMonth)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {dailyRate > 0 ? fmtEur(factureTheorique) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end">
                                            <input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                value={billedRaw}
                                                onChange={(e) => {
                                                    setEditedBilled((prev) => ({
                                                        ...prev,
                                                        [monthKey]: e.target.value,
                                                    }));
                                                }}
                                                className="w-28 text-right tabular-nums text-sm bg-transparent border border-input rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                                                aria-label={`Actual billed for ${month.monthYear}`}
                                            />
                                            <span className="ml-1 text-sm text-muted-foreground">€</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground/60">
                                        {fmtEur(0)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {dailyRate > 0 ? (
                                            <EcartValue value={ecartThMax} />
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {dailyRate > 0 ? (
                                            <EcartValue value={ecartEffTh} />
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
