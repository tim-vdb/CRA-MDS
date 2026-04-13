import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClientInfos from "@/features/Clients/components/ClientInfos";
import ClientTabs from "@/features/Clients/components/ClientTabs";

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const client = await prisma.clients.findUnique({
        where: { id },
        include: {
            cras: { include: { invoices: true }, orderBy: { date: "desc" } },
            invoices: { orderBy: { issuedAt: "desc" } },
        },
    });

    if (!client) return notFound();

    return (
        <div className="p-4 space-y-4">
            <ClientInfos client={client} />
            <ClientTabs cras={client.cras} invoices={client.invoices} client={client} />
        </div>
    );
}
