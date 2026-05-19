import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "L'email est invalide" }),
  password: z.string(),
});
