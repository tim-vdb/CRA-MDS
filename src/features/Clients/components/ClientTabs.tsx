"use client";

import { Button } from "@/components/ui/button";
import type { Activity, Clients, Invoice } from "@/generated/prisma_client";
import { Receipt } from "lucide-react";
import DetailledTable from "../../CRAS/components/DetailledTable";
import SummaryTable from "../../CRAS/components/SummaryTable";
import { useState } from "react";

type CRAWithInvoices = Activity & { invoices: Invoice[] };

interface ClientTabsProps {
    cras: CRAWithInvoices[];
    client: Clients;
    dailyRate: number;
}

export default function ClientTabs({ cras, client, dailyRate }: ClientTabsProps) {
    const [editedCras, setEditedCras] = useState<Record<string, { daysWorked: string }>>(
        cras.reduce((acc, cra) => {
            acc[cra.id] = { daysWorked: cra.daysWorked.toString() };
            return acc;
        }, {} as Record<string, { daysWorked: string }>)
    );
    const maxDays = client.maxDays ?? 0;
    const maxBudget = dailyRate * maxDays;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                        <Receipt className="h-3.5 w-3.5 mr-1.5" />
                        Déclarer Facture
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold">Détail des CRA</h3>
                <DetailledTable
                    cras={cras}
                    dailyRate={dailyRate}
                    maxDays={maxDays}
                    maxBudget={maxBudget}
                    editedCras={editedCras}
                    setEditedCras={setEditedCras}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold">Résumé Financier</h3>
                <SummaryTable
                    cras={cras}
                    dailyRate={dailyRate}
                    maxDays={maxDays}
                    maxBudget={maxBudget}
                    editedCras={editedCras}
                />
            </div>
        </div>
    );
}
