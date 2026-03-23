import z from 'zod';

export const SignUpFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom est requis d'au moins 2 caractères" })
    .max(50, { message: 'Le prénom ne doit pas dépasser 50 caractères' }),
  lastName: z
    .string()
    .min(2, { message: "Le nom est requis d'au moins 2 caractères" })
    .max(50, { message: 'Le nom ne doit pas dépasser 50 caractères' }),
  email: z.string().email(),
  password: z.string(),
});
