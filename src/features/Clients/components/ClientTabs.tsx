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
            <div className="space-y-4">
                <h3 className="text-sm font-semibold">Activity report detail</h3>
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
                <h3 className="text-sm font-semibold">Financial summary</h3>
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
