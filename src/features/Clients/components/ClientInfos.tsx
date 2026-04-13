import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Clients } from "@/generated/prisma_client";

interface ClientInfosProps {
    client: Clients;
}

export default function ClientInfos({ client }: ClientInfosProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl">{client.name}</CardTitle>
                        {client.company && (
                            <p className="text-sm text-muted-foreground mt-0.5">{client.company}</p>
                        )}
                    </div>
                    <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${client.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {client.isActive ? 'Actif' : 'Inactif'}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {/* Colonne gauche — Contact & Adresse */}
                    <div className="space-y-3">
                        {client.email && (
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm">{client.email}</p>
                            </div>
                        )}
                        {client.phone && (
                            <div>
                                <p className="text-xs text-muted-foreground">Téléphone</p>
                                <p className="text-sm">{client.phone}</p>
                            </div>
                        )}
                        {client.address && (
                            <div>
                                <p className="text-xs text-muted-foreground">Adresse</p>
                                <p className="text-sm">{client.address}</p>
                                {(client.city || client.postalCode) && (
                                    <p className="text-sm">
                                        {client.postalCode} {client.city}
                                    </p>
                                )}
                                {client.country && (
                                    <p className="text-sm">{client.country}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Colonne droite — Infos business & contrat */}
                    <div className="space-y-3">
                        {client.siret && (
                            <div>
                                <p className="text-xs text-muted-foreground">SIRET</p>
                                <p className="text-sm font-mono">{client.siret}</p>
                            </div>
                        )}
                        {client.vatNumber && (
                            <div>
                                <p className="text-xs text-muted-foreground">N° TVA</p>
                                <p className="text-sm font-mono">{client.vatNumber}</p>
                            </div>
                        )}
                        {client.dailyRate && (
                            <div>
                                <p className="text-xs text-muted-foreground">TJM</p>
                                <p className="text-sm font-semibold">{client.dailyRate.toLocaleString('fr-FR')} €</p>
                            </div>
                        )}
                        {(client.startDate || client.endDate) && (
                            <div className="flex gap-6">
                                {client.startDate && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date de début</p>
                                        <p className="text-sm">{new Date(client.startDate).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                )}
                                {client.endDate && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date de fin</p>
                                        <p className="text-sm">{new Date(client.endDate).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
