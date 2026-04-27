"use client";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileText, Receipt, Info } from "lucide-react";
import type {
    Activity,
    Clients,
    Invoice,
    InvoiceStatus,
} from "@/generated/prisma_client";
import { cn } from "@/utils/utils";

type CRAWithInvoices = Activity & { invoices: Invoice[] };

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

function formatPeriod(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });
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

function CraStatusDot({ activity }: { activity: Activity }) {
    if (activity.validatedAt) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>Validé</TooltipContent>
            </Tooltip>
        );
    }
    if (activity.rejectedAt) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                    Rejeté{activity.rejectionReason ? ` — ${activity.rejectionReason}` : ""}
                </TooltipContent>
            </Tooltip>
        );
    }
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            </TooltipTrigger>
            <TooltipContent>En attente de validation</TooltipContent>
        </Tooltip>
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

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
    DRAFT: "Brouillon",
    ISSUED: "Émise",
    PAID: "Payée",
    OVERDUE: "En retard",
};

const INVOICE_STATUS_CLASSES: Record<InvoiceStatus, string> = {
    DRAFT: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
    ISSUED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface ClientTabsProps {
    cras: CRAWithInvoices[];
    invoices: Invoice[];
    client: Clients;
}

function TabCount({ count }: { count: number }) {
    return (
        <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-muted px-1.5 min-w-[18px] h-[18px] text-[11px] font-medium text-muted-foreground">
            {count}
        </span>
    );
}

export default function ClientTabs({ cras, invoices, client }: ClientTabsProps) {
    const dailyRate = client.dailyRate ?? 0;
    const maxDays = client.maxDays ?? 0;
    const maxBudget = dailyRate * maxDays;

    const totalDays = cras.reduce((sum, cra) => sum + cra.daysWorked, 0);
    const totalTheorique = totalDays * dailyRate;
    const totalEffectif = cras.reduce(
        (sum, cra) => sum + cra.invoices.reduce((s, inv) => s + inv.amountHT, 0),
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

    const invoiceTotalHT = invoices.reduce((s, inv) => s + inv.amountHT, 0);
    const invoiceTotalTTC = invoices.reduce((s, inv) => s + inv.amountTTC, 0);

    return (
        <TooltipProvider delayDuration={150}>
            <Tabs defaultValue="compte-rendu">
                {/* ── Tab bar ───────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <TabsList>
                        <TabsTrigger value="compte-rendu">
                            Compte Rendu
                            <TabCount count={cras.length} />
                        </TabsTrigger>
                        <TabsTrigger value="factures">
                            Factures
                            <TabCount count={invoices.length} />
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Générer CRA
                        </Button>
                        <Button size="sm">
                            <Receipt className="h-3.5 w-3.5 mr-1.5" />
                            Créer Facture
                        </Button>
                    </div>
                </div>

                {/* ── CRA Tab ───────────────────────────────────── */}
                <TabsContent value="compte-rendu" className="mt-4">
                    <div className="rounded-lg border overflow-hidden bg-card">
                        {/* Sub-header: TJ + Plafond */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-2.5 border-b bg-muted/30 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    TJ
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
                                            Plafond
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

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[160px]">Période</TableHead>
                                    <TableHead className="text-right w-[80px]">Jours</TableHead>
                                    <TableHead className="text-right">Facturé théorique</TableHead>
                                    <TableHead className="text-right">Facturé effectif</TableHead>
                                    <TableHead className="text-right">Max théorique</TableHead>
                                    <TableHead className="text-right">
                                        <span className="inline-flex items-center justify-end gap-1.5">
                                            Écart théorique / max
                                            <HeaderInfo>
                                                <p className="font-semibold text-[11px] uppercase tracking-wide opacity-70">
                                                    Comparaison vs plafond contrat
                                                </p>
                                                <p>
                                                    <span className="text-orange-300 font-semibold">Positif</span> :
                                                    trop de jours réalisés, on dépasse le budget alloué — il faut
                                                    réduire l&apos;effort.
                                                </p>
                                                <p>
                                                    <span className="text-blue-300 font-semibold">Négatif</span> :
                                                    il reste des jours à réaliser pour atteindre le plafond.
                                                </p>
                                            </HeaderInfo>
                                        </span>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <span className="inline-flex items-center justify-end gap-1.5">
                                            Écart effectif / théorique
                                            <HeaderInfo>
                                                <p className="font-semibold text-[11px] uppercase tracking-wide opacity-70">
                                                    Comparaison facturé vs travail réalisé
                                                </p>
                                                <p>
                                                    <span className="text-orange-300 font-semibold">Positif</span> :
                                                    déjà facturé pour des jours qu&apos;il reste à réaliser
                                                    (avance de facturation).
                                                </p>
                                                <p>
                                                    <span className="text-blue-300 font-semibold">Négatif</span> :
                                                    la facturation est en retard sur le travail effectivement réalisé.
                                                </p>
                                            </HeaderInfo>
                                        </span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {cras.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground py-14"
                                        >
                                            <FileText className="h-8 w-8 mx-auto mb-2.5 opacity-25" />
                                            <p className="text-sm font-medium">Aucun compte rendu</p>
                                            <p className="text-xs mt-0.5 opacity-70">
                                                Les CRA soumis par le client apparaîtront ici
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cras.map((cra) => {
                                        const factureTheorique = cra.daysWorked * dailyRate;
                                        const factureEffectif = cra.invoices.reduce(
                                            (s, inv) => s + inv.amountHT,
                                            0
                                        );
                                        const ecartThMax = factureTheorique;
                                        const ecartEffTh = factureEffectif - factureTheorique;

                                        return (
                                            <TableRow key={cra.id} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <CraStatusDot activity={cra} />
                                                        <span>{formatPeriod(cra.date)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {cra.daysWorked.toLocaleString("fr-FR")}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {dailyRate > 0 ? fmtEur(factureTheorique) : "—"}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {fmtEur(factureEffectif)}
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

                            {cras.length > 0 && (
                                <TableFooter className="bg-muted/20">
                                    {/* Écart total € */}
                                    <TableRow className="border-t-2">
                                        <TableCell
                                            colSpan={5}
                                            className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2"
                                        >
                                            Écart total €
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            <EcartValue value={ecartThMaxEur} />
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            <EcartValue value={ecartEffThEur} />
                                        </TableCell>
                                    </TableRow>

                                    {/* Écart total jours */}
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2"
                                        >
                                            Écart total jours
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
                                        <TableCell
                                            colSpan={3}
                                            className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2"
                                        >
                                            Facturé
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums font-semibold py-2">
                                            {fmtEur(totalEffectif)}
                                        </TableCell>
                                        <TableCell colSpan={3} />
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            colSpan={2}
                                            className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground py-2"
                                        >
                                            Reste à facturer
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
                                            Consommé
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
                                            Reste à consommer
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
                                </TableFooter>
                            )}
                        </Table>
                    </div>

                    {/* Légende des écarts */}
                    {cras.length > 0 && dailyRate > 0 && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-md border bg-muted/20 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                                    Écart théorique / max
                                </p>
                                <ul className="space-y-1 text-xs leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="text-orange-600 dark:text-orange-400 font-semibold shrink-0">
                                            Positif
                                        </span>
                                        <span className="text-muted-foreground">
                                            trop de jours réalisés, on dépasse le budget alloué.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-red-600 dark:text-red-400 font-semibold shrink-0">
                                            Négatif
                                        </span>
                                        <span className="text-muted-foreground">
                                            il reste des jours à réaliser pour atteindre le plafond.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                                    Écart effectif / théorique
                                </p>
                                <ul className="space-y-1 text-xs leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="text-orange-600 dark:text-orange-400 font-semibold shrink-0">
                                            Positif
                                        </span>
                                        <span className="text-muted-foreground">
                                            déjà facturé pour des jours qu&apos;il reste à réaliser.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-red-600 dark:text-red-400 font-semibold shrink-0">
                                            Négatif
                                        </span>
                                        <span className="text-muted-foreground">
                                            la facturation est en retard sur le travail effectué.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* ── Factures Tab ──────────────────────────────── */}
                <TabsContent value="factures" className="mt-4">
                    {invoices.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(["PAID", "ISSUED", "OVERDUE", "DRAFT"] as InvoiceStatus[]).map(
                                (status) => {
                                    const count = invoices.filter(
                                        (inv) => inv.status === status
                                    ).length;
                                    if (count === 0) return null;
                                    return (
                                        <span
                                            key={status}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${INVOICE_STATUS_CLASSES[status]}`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                            {INVOICE_STATUS_LABELS[status]} ({count})
                                        </span>
                                    );
                                }
                            )}
                        </div>
                    )}

                    <div className="rounded-lg border overflow-hidden bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N° Facture</TableHead>
                                    <TableHead>Date d&apos;émission</TableHead>
                                    <TableHead className="text-right">Montant HT</TableHead>
                                    <TableHead className="text-right text-muted-foreground">
                                        TVA
                                    </TableHead>
                                    <TableHead className="text-right">Montant TTC</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground py-14"
                                        >
                                            <Receipt className="h-8 w-8 mx-auto mb-2.5 opacity-25" />
                                            <p className="text-sm font-medium">Aucune facture</p>
                                            <p className="text-xs mt-0.5 opacity-70">
                                                Les factures émises pour ce client apparaîtront ici
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="hover:bg-muted/30">
                                            <TableCell className="font-mono font-medium text-sm">
                                                {invoice.number}
                                            </TableCell>
                                            <TableCell className="tabular-nums">
                                                {invoice.issuedAt
                                                    ? new Date(invoice.issuedAt).toLocaleDateString("fr-FR")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {invoice.amountHT.toLocaleString("fr-FR", {
                                                    minimumFractionDigits: 2,
                                                })}{" "}
                                                €
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums text-muted-foreground text-xs">
                                                {invoice.tvaRate}&nbsp;%
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums font-medium">
                                                {invoice.amountTTC.toLocaleString("fr-FR", {
                                                    minimumFractionDigits: 2,
                                                })}{" "}
                                                €
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${INVOICE_STATUS_CLASSES[invoice.status]}`}
                                                >
                                                    {INVOICE_STATUS_LABELS[invoice.status]}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                            {invoices.length > 0 && (
                                <TableFooter className="bg-muted/40">
                                    <TableRow className="border-t-2 font-semibold">
                                        <TableCell colSpan={2} className="py-3">
                                            Total — {invoices.length} facture
                                            {invoices.length > 1 ? "s" : ""}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums py-3">
                                            {fmtEur(invoiceTotalHT)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell className="text-right tabular-nums py-3">
                                            {fmtEur(invoiceTotalTTC)}
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </TooltipProvider>
    );
}
