export type Invoice = {
    id: string;
    amountHT: number | null;
    amountTTC: number | null;
    tvaRate: number | null;
    status: string | null;
    number: string | null;
    issuedAt: string | null;
};
 
export type CraActivity = {
    id: string;
    date: string;
    daysWorked: number;
    invoices: Invoice[];
};
 
export type CraClient = {
    id: string;
    name: string;
    dailyRate: number | null;
    maxDays: number | null;
    activities: CraActivity[];
};
 
// Derived summary per client
export type CraSummary = {
    clientId: string;
    clientName: string;
    dailyRate: number | null;
    maxDays: number | null;
    totalDays: number;
    totalBilledHT: number;       // sum of invoice amountHT
    theoreticalBilled: number;   // totalDays × dailyRate
    gap: number;                 // theoreticalBilled - totalBilledHT
    remainingDays: number;       // maxDays - totalDays
};