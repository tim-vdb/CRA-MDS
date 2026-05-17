import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Activity, Clients, Invoice } from "@/generated/prisma_client";
import {
    Mail,
    Phone,
    MapPin,
    Building2,
    Hash,
    Receipt,
    CalendarRange,
    Briefcase,
} from "lucide-react";
import { cn } from "@/utils/utils";
import EditClientModal from "./EditClientModal";
import { ExportCsvButton } from "./ExportCsvButton";

type ActivityWithInvoices = Activity & { invoices: Invoice[] };
export type ClientWithRelations = Clients & {
    activities: ActivityWithInvoices[];
    invoices: Invoice[];
};

interface ClientInfosProps {
    client: ClientWithRelations;
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                    {label}
                </p>
                <p className="text-sm leading-snug break-words">{value}</p>
            </div>
        </div>
    );
}

function KpiCard({
    label,
    value,
    sub,
    warning,
}: {
    label: string;
    value: string;
    sub?: string;
    warning?: boolean;
}) {
    return (
        <Card className={warning ? "border-orange-300 dark:border-orange-700" : ""}>
            <CardContent className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p
                    className={cn("text-2xl font-bold mt-1.5 tabular-nums leading-none", warning ? "text-orange-600 dark:text-orange-400" : ""
                    )}
                >
                    {value}
                </p>
                {sub && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{sub}</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ClientInfos({ client }: ClientInfosProps) {
    const initials = client.name
        .split(" ")
        .map((w) => w[0] ?? "")
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const dailyRate = client.dailyRate ?? 0;
    const maxDays = client.maxDays ?? 0;

    const totalDays = client.activities.reduce((sum, a) => sum + a.daysWorked, 0);
    const totalTheorique = dailyRate * totalDays;
    const totalPaid = client.invoices
        .filter((inv) => inv.status === "PAID")
        .reduce((sum, inv) => sum + inv.amountHT, 0);
    const totalPending = client.invoices
        .filter((inv) => inv.status === "ISSUED" || inv.status === "OVERDUE")
        .reduce((sum, inv) => sum + inv.amountHT, 0);

    const budget = dailyRate * maxDays;
    const progress = maxDays > 0 ? Math.min(110, (totalDays / maxDays) * 100) : null;
    const progressClamped = progress !== null ? Math.min(100, progress) : null;

    const fmtEur = (v: number) =>
        v.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
        " €";
    const fmtDays = (v: number) =>
        v.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 1 }) +
        " j";

    const progressBarColor =
        progress === null
            ? ""
            : progress >= 100
                ? "bg-red-500"
                : progress >= 80
                    ? "bg-orange-500"
                    : "bg-primary";

    const addressLine = [
        client.address,
        [client.postalCode, client.city].filter(Boolean).join(" "),
        client.country !== "France" ? client.country : null,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="space-y-4">
            {/* ── Header ─────────────────────────────────────── */}
            <Card>
                <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Avatar */}
                        <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0 border border-primary/20 select-none">
                            {initials}
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight leading-none">
                                    {client.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={
                                        client.isActive
                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                            : "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                                    }
                                >
                                    {client.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            {client.company && (
                                <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                                    {client.company}
                                </p>
                            )}

                            {(client.startDate || client.endDate) && (
                                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                                    <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                                    {client.startDate
                                        ? new Date(client.startDate).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "?"}
                                    &nbsp;→&nbsp;
                                    {client.endDate
                                        ? new Date(client.endDate).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })
                                        : "Ongoing"}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <ExportCsvButton
                                client={client}
                                activities={client.activities}
                            />
                            <EditClientModal client={client} />
                        </div>
                    </div>

                    <Separator className="my-5" />

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                        {client.email && (
                            <InfoItem icon={Mail} label="Email" value={client.email} />
                        )}
                        {client.phone && (
                            <InfoItem icon={Phone} label="Phone" value={client.phone} />
                        )}
                        {addressLine && (
                            <InfoItem icon={MapPin} label="Address" value={addressLine} />
                        )}
                        {client.siret && (
                            <InfoItem icon={Hash} label="SIRET" value={client.siret} />
                        )}
                        {client.vatNumber && (
                            <InfoItem icon={Receipt} label="VAT number" value={client.vatNumber} />
                        )}
                        {dailyRate > 0 && (
                            <InfoItem
                                icon={Briefcase}
                                label="Daily rate"
                                value={`${fmtEur(dailyRate)} / day`}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── KPI cards ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <KpiCard
                    label="Days worked"
                    value={fmtDays(totalDays)}
                    sub={maxDays > 0 ? `out of ${fmtDays(maxDays)} allocated` : "No cap defined"}
                />
                <KpiCard
                    label="Theoretical revenue"
                    value={dailyRate > 0 ? fmtEur(totalTheorique) : "—"}
                    sub={budget > 0 ? `Contract budget: ${fmtEur(budget)}` : undefined}
                />
                <KpiCard
                    label="Collected"
                    value={fmtEur(totalPaid)}
                    sub={
                        totalPending > 0
                            ? `${fmtEur(totalPending)} pending payment`
                            : "No pending amount"
                    }
                />
                {/* <KpiCard
                    label="Progress"
                    value={progress !== null ? `${Math.round(progress)} %` : "—"}
                    sub={
                        progress === null
                            ? "No cap defined"
                            : progress >= 100
                                ? "Budget exceeded!"
                                : progress >= 80
                                    ? "Watch your budget"
                                    : "Within contract limits"
                    }
                    warning={progress !== null && progress >= 80}
                /> */}
            </div>

            {/* ── Progress bar ────────────────────────────────── */}
            {progressClamped !== null && (
                <div className="space-y-2 px-0.5">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Budget consumption
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                            {fmtDays(totalDays)} / {fmtDays(maxDays)}
                        </span>
                    </div>
                    <div
                        className="h-2 rounded-full bg-muted overflow-hidden"
                        role="progressbar"
                        aria-valuenow={Math.round(progressClamped)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                            style={{ width: `${progressClamped}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {totalDays > maxDays
                            ? `Exceeded by ${fmtDays(totalDays - maxDays)}${dailyRate > 0 ? ` (${fmtEur((totalDays - maxDays) * dailyRate)})` : ""}`
                            : totalDays === maxDays
                                ? "Budget fully consumed"
                                : `Remaining ${fmtDays(maxDays - totalDays)} to consume${dailyRate > 0 ? ` (${fmtEur((maxDays - totalDays) * dailyRate)})` : ""}`}
                    </p>
                </div>
            )}
        </div>
    );
}
