"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Activity, Clients, Invoice, InvoiceStatus } from "@/generated/prisma_client"

const MONTHS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

type CRAWithInvoices = Activity & { invoices: Invoice[] }

function formatEur(value: number) {
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '\u00a0€'
}

function EcartCell({ value, unit = '€' }: { value: number; unit?: string }) {
    const formatted =
        unit === '€'
            ? formatEur(value)
            : `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}j`
    if (value > 0) return <span className="text-orange-600 dark:text-orange-400">{formatted}</span>
    if (value < 0) return <span className="text-red-600 dark:text-red-400">{formatted}</span>
    return <span>{formatted}</span>
}

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
    DRAFT: 'Brouillon',
    ISSUED: 'Émise',
    PAID: 'Payée',
    OVERDUE: 'En retard',
}

const INVOICE_STATUS_CLASSES: Record<InvoiceStatus, string> = {
    DRAFT: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    ISSUED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PAID: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface ClientTabsProps {
    cras: CRAWithInvoices[]
    invoices: Invoice[]
    client: Clients
}

export default function ClientTabs({ cras, invoices, client }: ClientTabsProps) {
    const dailyRate = client.dailyRate ?? 0
    const maxDays = client.maxDays ?? 0
    const maxBudget = maxDays * dailyRate

    const totalDays = cras.reduce((sum, cra) => sum + cra.daysWorked, 0)
    const totalTheorique = totalDays * dailyRate
    const totalEffectif = cras.reduce(
        (sum, cra) => sum + cra.invoices.reduce((s, inv) => s + inv.amountHT, 0),
        0
    )

    const ecartThMaxEur = totalTheorique - maxBudget
    const ecartThMaxDays = totalDays - maxDays
    const ecartEffThEur = totalEffectif - totalTheorique
    const ecartEffThDays = dailyRate > 0 ? ecartEffThEur / dailyRate : 0

    const resteAFacturerEur = totalTheorique - totalEffectif
    const resteAConsommerDays = Math.max(0, maxDays - totalDays)
    const resteAConsommerEur = Math.max(0, maxBudget - totalTheorique)
    const totalFinalDays = maxDays > 0 ? Math.max(totalDays, maxDays) : totalDays
    const totalFinalEur = maxBudget > 0 ? Math.max(totalTheorique, maxBudget) : totalTheorique

    return (
        <div className="space-y-4">
            <Tabs defaultValue="compte-rendu">
                <TabsList>
                    <TabsTrigger value="compte-rendu">Compte Rendu</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="compte-rendu" className="mt-4">
                    <div className="rounded-md border">
                        {/* TJ header */}
                        <div className="flex items-center gap-4 px-4 py-2 border-b bg-muted/40 text-sm">
                            <span className="text-muted-foreground font-medium">TJ</span>
                            <span className="font-semibold">
                                {dailyRate > 0 ? formatEur(dailyRate) : '—'}
                            </span>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Période</TableHead>
                                    <TableHead className="text-right">Jours</TableHead>
                                    <TableHead className="text-right">Facturé théorique</TableHead>
                                    <TableHead className="text-right">Facturé effectif</TableHead>
                                    <TableHead className="text-right">Max théorique</TableHead>
                                    <TableHead className="text-right">Ecart théorique / max</TableHead>
                                    <TableHead className="text-right">Ecart effectif / théorique</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {cras.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                            Aucun compte rendu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cras.map((cra) => {
                                        const factureTheorique = cra.daysWorked * dailyRate
                                        const factureEffectif = cra.invoices.reduce((s, inv) => s + inv.amountHT, 0)
                                        const ecartThMax = factureTheorique - 0
                                        const ecartEffTh = factureEffectif - factureTheorique

                                        return (
                                            <TableRow key={cra.id}>
                                                <TableCell className="font-medium">
                                                    {MONTHS_FR[cra.month - 1]} {cra.year}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {cra.daysWorked.toLocaleString('fr-FR')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {dailyRate > 0 ? formatEur(factureTheorique) : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatEur(factureEffectif)}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatEur(0)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <EcartCell value={ecartThMax} />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <EcartCell value={ecartEffTh} />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>

                            {cras.length > 0 && (
                                <TableFooter>
                                    {/* Ecart totals */}
                                    <TableRow className="border-t-2">
                                        <TableCell colSpan={3} className="text-muted-foreground text-xs uppercase tracking-wide py-2">
                                            Ecart total €
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell className="text-right font-medium">
                                            <EcartCell value={ecartThMaxEur} />
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <EcartCell value={ecartEffThEur} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-muted-foreground text-xs uppercase tracking-wide py-2">
                                            Ecart total jours
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell className="text-right font-medium">
                                            <EcartCell value={ecartThMaxDays} unit="j" />
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <EcartCell value={ecartEffThDays} unit="j" />
                                        </TableCell>
                                    </TableRow>

                                    {/* Facturation */}
                                    <TableRow className="border-t">
                                        <TableCell colSpan={3} className="text-muted-foreground text-xs uppercase tracking-wide py-2">
                                            Facturé
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatEur(totalEffectif)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-muted-foreground text-xs uppercase tracking-wide py-2">
                                            Reste à facturer
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatEur(resteAFacturerEur)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>

                                    {/* Consommation */}
                                    <TableRow className="border-t">
                                        <TableCell className="text-muted-foreground text-xs uppercase tracking-wide py-2">
                                            Consommé
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {totalDays.toLocaleString('fr-FR')}j
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatEur(totalTheorique)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-muted-foreground text-xs uppercase tracking-wide py-2">
                                            Reste à consommer
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {resteAConsommerDays.toLocaleString('fr-FR')}j
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatEur(resteAConsommerEur)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                    <TableRow className="font-bold">
                                        <TableCell className="text-xs uppercase tracking-wide py-2">
                                            Total
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {totalFinalDays.toLocaleString('fr-FR')}j
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatEur(totalFinalEur)}
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N° Facture</TableHead>
                                    <TableHead>Date d&apos;émission</TableHead>
                                    <TableHead className="text-right">Montant HT</TableHead>
                                    <TableHead className="text-right">Montant TTC</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            Aucune facture
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-mono font-medium">{invoice.number}</TableCell>
                                            <TableCell>
                                                {invoice.issuedAt
                                                    ? new Date(invoice.issuedAt).toLocaleDateString('fr-FR')
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {invoice.amountHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {invoice.amountTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${INVOICE_STATUS_CLASSES[invoice.status]}`}>
                                                    {INVOICE_STATUS_LABELS[invoice.status]}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline">Générer CRA</Button>
                <Button>Créer Facture</Button>
            </div>
        </div>
    )
}
