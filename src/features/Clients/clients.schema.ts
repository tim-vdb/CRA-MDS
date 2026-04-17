import { z } from "zod";

export const CreateClientSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email().optional().or(z.literal("")),
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