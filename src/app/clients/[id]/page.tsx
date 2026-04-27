import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ClientInfos from "@/features/Clients/components/ClientInfos";
import ClientTabs from "@/features/Clients/components/ClientTabs";

export default async function ClientPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const client = await prisma.clients.findUnique({
        where: { id },
        include: {
            activities: { include: { invoices: true }, orderBy: { date: "desc" } },
            invoices: { orderBy: { issuedAt: "desc" } },
        },
    });

    if (!client) return notFound();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Fil d'Ariane">
                <Link
                    href="/clients"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    Clients
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium truncate">{client.name}</span>
            </nav>

            <ClientInfos client={client} />
            <ClientTabs
                cras={client.activities}
                invoices={client.invoices}
                client={client}
            />
        </div>
    );
}
