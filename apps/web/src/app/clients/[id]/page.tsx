import { Card } from "../../../components/ui/card";
import ClientInfos from "../../../features/Clients/components/ClientInfos";
import ClientTabs from "../../../features/Clients/components/ClientTabs";
import { prisma } from "../../../lib/prisma";
import { getUser } from "../../../lib/auth-session";
import { notFound, redirect } from "next/navigation";

export default async function ClientPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;

    const client = await prisma.clients.findUnique({
        where: { id },
        include: {
            activities: { include: { invoices: true }, orderBy: { date: "desc" } },
            invoices: { orderBy: { issuedAt: "desc" } },
        },
    });

    if (!client || client.userId !== user.id) {
        return notFound();
    }

    const dailyRate = client?.dailyRate ?? 0;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <ClientInfos client={client} />

            <ClientTabs
                cras={client.activities}
                client={client}
                dailyRate={dailyRate}
            />

            {/* Légende des écarts */}
            {client.activities.length > 0 && dailyRate > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card className="p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Écart théorique / max
                        </p>
                        <ul className="space-y-1 text-xs leading-relaxed">
                            <li className="flex gap-2">
                                <span className="text-orange-600 dark:text-orange-400 font-semibold shrink-0">
                                    +
                                </span>
                                <span className="text-muted-foreground">
                                    Dépassement du budget alloué
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-600 dark:text-red-400 font-semibold shrink-0">
                                    -
                                </span>
                                <span className="text-muted-foreground">
                                    Jours restants à réaliser
                                </span>
                            </li>
                        </ul>
                    </Card>
                    <Card className="p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Écart effectif / théorique
                        </p>
                        <ul className="space-y-1 text-xs leading-relaxed">
                            <li className="flex gap-2">
                                <span className="text-orange-600 dark:text-orange-400 font-semibold shrink-0">
                                    +
                                </span>
                                <span className="text-muted-foreground">
                                    Avance de facturation
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-600 dark:text-red-400 font-semibold shrink-0">
                                    -
                                </span>
                                <span className="text-muted-foreground">
                                    Facturation en retard
                                </span>
                            </li>
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
}
