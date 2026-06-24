import { z } from 'zod';

// Mirrors the Prisma `Clients` model fields the API returns.
export type Client = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    siret: string | null;
    vatNumber: string | null;
    dailyRate: number | null;
    maxDays: number | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
};

// Mirrors CreateClientSchema / UpdateClientSchema on the web. Optional text
// fields accept "" so the form can submit empty inputs without validation noise.
export const ClientFormSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    postalCode: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    siret: z.string().optional().or(z.literal('')),
    vatNumber: z.string().optional().or(z.literal('')),
    dailyRate: z.number().nonnegative('Doit être positif').nullable().optional(),
    maxDays: z.number().nonnegative('Doit être positif').nullable().optional(),
    isActive: z.boolean(),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
});

export type ClientFormInput = z.infer<typeof ClientFormSchema>;

export const emptyClientForm: ClientFormInput = {
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    siret: '',
    vatNumber: '',
    dailyRate: null,
    maxDays: null,
    isActive: true,
    startDate: '',
    endDate: '',
};

// Build a form snapshot from an existing client (for the edit modal).
export function clientToForm(c: Client): ClientFormInput {
    return {
        name: c.name,
        email: c.email ?? '',
        phone: c.phone ?? '',
        company: c.company ?? '',
        address: c.address ?? '',
        city: c.city ?? '',
        postalCode: c.postalCode ?? '',
        country: c.country ?? 'France',
        siret: c.siret ?? '',
        vatNumber: c.vatNumber ?? '',
        dailyRate: c.dailyRate,
        maxDays: c.maxDays,
        isActive: c.isActive,
        startDate: c.startDate ?? '',
        endDate: c.endDate ?? '',
    };
}
