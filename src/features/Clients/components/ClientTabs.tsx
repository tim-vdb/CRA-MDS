"use client";

import type { Activity, Clients, Invoice } from "@/generated/prisma_client";
import dayjs from "dayjs";
import DetailledTable from "../../CRAS/components/DetailledTable";
import SummaryTable from "../../CRAS/components/SummaryTable";
import { ExportCsvButton } from "./ExportCsvButton";
import { useState } from "react";

type CRAWithInvoices = Activity & { invoices: Invoice[] };

interface ClientTabsProps {
    cras: CRAWithInvoices[];
    client: Clients;
    dailyRate: number;
}

function initBilledByMonth(cras: CRAWithInvoices[]): Record<string, string> {
    const acc: Record<string, number> = {};
    for (const cra of cras) {
        const key = dayjs(cra.date).format("YYYY-MM");
        const invoiceTotal = cra.invoices.reduce((s, inv) => s + inv.amountHT, 0);
        acc[key] = (acc[key] ?? 0) + invoiceTotal;
    }
    return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, v.toString()]));
}

export default function ClientTabs({ cras, client, dailyRate }: ClientTabsProps) {
    const [editedCras, setEditedCras] = useState<Record<string, { daysWorked: string }>>(
        cras.reduce((acc, cra) => {
            acc[cra.id] = { daysWorked: cra.daysWorked.toString() };
            return acc;
        }, {} as Record<string, { daysWorked: string }>)
    );

    const [editedBilled, setEditedBilled] = useState<Record<string, string>>(
        () => initBilledByMonth(cras)
    );

    const maxDays = client.maxDays ?? 0;
    const maxBudget = dailyRate * maxDays;

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Activity report detail</h3>
                    <ExportCsvButton
                        client={client}
                        activities={cras}
                        editedBilled={editedBilled}
                    />
                </div>
                <DetailledTable
                    cras={cras}
                    dailyRate={dailyRate}
                    maxDays={maxDays}
                    maxBudget={maxBudget}
                    editedCras={editedCras}
                    setEditedCras={setEditedCras}
                    editedBilled={editedBilled}
                    setEditedBilled={setEditedBilled}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold">Financial summary</h3>
                <SummaryTable
                    cras={cras}
                    dailyRate={dailyRate}
                    maxDays={maxDays}
                    maxBudget={maxBudget}
                    editedCras={editedCras}
                    editedBilled={editedBilled}
                />
            </div>
        </div>
    );
}
