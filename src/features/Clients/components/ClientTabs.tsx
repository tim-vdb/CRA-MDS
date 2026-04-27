"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Receipt } from "lucide-react";
import type { Activity, Clients, Invoice, InvoiceStatus } from "@/generated/prisma_client";

const MONTHS_FR = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

type CRAWithInvoices = Activity & { invoices: Invoice[] };

function fmtEur(value: number) {
    return (
        value.toLocaleString("fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }) + " €"
    );
}

function fmtDays(value: number) {
    return (
        value.toLocaleString("fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        }) + " j"
    );
}

function EcartCell({ value }: { value: number }) {
    if (value === 0) return <span className="text-muted-foreground">—</span>;
    if (value > 0)
        return (
            <span className="text-orange-600 dark:text-orange-400 tabular-nums">
                +{fmtEur(value)}
            </span>
        );
    return (
        <span className="text-red-600 dark:text-red-400 tabular-nums">
            {fmtEur(value)}
        </span>
    );
}

function CraStatusBadge({ activity }: { activity: Activity }) {
    if (activity.validatedAt) {
        return (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Validé
            </span>
        );
    }
    if (activity.rejectedAt) {
        return (
            <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 cursor-help"
                title={activity.rejectionReason ?? "Aucun motif renseigné"}
            >
                Rejeté
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            En attente
        </span>
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
    const budget = dailyRate * maxDays;

    const totalDays = cras.reduce((sum, cra) => sum + cra.daysWorked, 0);
    const totalTheorique = totalDays * dailyRate;
    const totalEffectif = cras.reduce(
        (sum, cra) => sum + cra.invoices.reduce((s, inv) => s + inv.amountHT, 0),
        0
    );
    const ecartEffTh = totalEffectif - totalTheorique;

    const resteAConsommerDays = maxDays > 0 ? Math.max(0, maxDays - totalDays) : null;
    const resteAConsommerEur =
        resteAConsommerDays !== null ? resteAConsommerDays * dailyRate : null;

    const invoiceTotalHT = invoices.reduce((s, inv) => s + inv.amountHT, 0);
    const invoiceTotalTTC = invoices.reduce((s, inv) => s + inv.amountTTC, 0);

    return (
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
                <div className="rounded-lg border overflow-hidden">
                    {/* Sub-header: TJM + plafond */}
                    {dailyRate > 0 && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 border-b bg-muted/30 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    TJM
                                </span>
                                <span className="font-semibold tabular-nums">{fmtEur(dailyRate)}</span>
                            </div>
                            {maxDays > 0 && (
                                <>
                                    <span className="text-muted-foreground/40">|</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            Plafond
                                        </span>
                                        <span className="font-semibold tabular-nums">
                                            {fmtDays(maxDays)}{" "}
                                            <span className="text-muted-foreground font-normal">
                                                ({fmtEur(budget)})
                                            </span>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Période</TableHead>
                                <TableHead className="w-[110px]">Statut</TableHead>
                                <TableHead className="text-right w-20">Jours</TableHead>
                                <TableHead className="text-right">Théorique</TableHead>
                                <TableHead className="text-right">Facturé</TableHead>
                                <TableHead className="text-right">Écart</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {cras.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
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
                                    const theorique = cra.daysWorked * dailyRate;
                                    const effectif = cra.invoices.reduce(
                                        (s, inv) => s + inv.amountHT,
                                        0
                                    );
                                    const ecart = effectif - theorique;

                                    return (
                                        <TableRow key={cra.id}>
                                            <TableCell className="font-medium">
                                                {MONTHS_FR[cra.month - 1]} {cra.year}
                                            </TableCell>
                                            <TableCell>
                                                <CraStatusBadge activity={cra} />
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {cra.daysWorked.toLocaleString("fr-FR")}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {dailyRate > 0 ? fmtEur(theorique) : "—"}
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {fmtEur(effectif)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {dailyRate > 0 ? (
                                                    <EcartCell value={ecart} />
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>

                        {cras.length > 0 && (
                            <TableFooter>
                                <TableRow className="border-t-2 font-semibold text-sm">
                                    <TableCell colSpan={2} className="py-3">
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums py-3">
                                        {fmtDays(totalDays)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums py-3">
                                        {dailyRate > 0 ? fmtEur(totalTheorique) : "—"}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums py-3">
                                        {fmtEur(totalEffectif)}
                                    </TableCell>
                                    <TableCell className="text-right py-3">
                                        {dailyRate > 0 ? <EcartCell value={ecartEffTh} /> : "—"}
                                    </TableCell>
                                </TableRow>

                                {resteAConsommerDays !== null && (
                                    <TableRow className="text-xs text-muted-foreground border-t">
                                        <TableCell
                                            colSpan={2}
                                            className="py-2 font-semibold uppercase tracking-wide"
                                        >
                                            Reste à consommer
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums py-2">
                                            {fmtDays(resteAConsommerDays)}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums py-2">
                                            {resteAConsommerEur !== null
                                                ? fmtEur(resteAConsommerEur)
                                                : "—"}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                )}
                            </TableFooter>
                        )}
                    </Table>
                </div>
            </TabsContent>

            {/* ── Factures Tab ──────────────────────────────── */}
            <TabsContent value="factures" className="mt-4">
                {/* Status summary chips */}
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

                <div className="rounded-lg border overflow-hidden">
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
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-mono font-medium text-sm">
                                            {invoice.number}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            {invoice.issuedAt
                                                ? new Date(invoice.issuedAt).toLocaleDateString(
                                                      "fr-FR"
                                                  )
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
                            <TableFooter>
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
    );
}
