import { z } from "zod";

export const CreateClientSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("France"),
  siret: z.string().optional(),
  vatNumber: z.string().optional(),
  dailyRate: z.coerce.number().optional(),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  siret: z.string().optional().or(z.literal("")),
  vatNumber: z.string().optional().or(z.literal("")),
  dailyRate: z.number().nonnegative("Doit être positif").nullable().optional(),
  maxDays: z.number().nonnegative("Doit être positif").nullable().optional(),
  isActive: z.boolean(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
});

export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
