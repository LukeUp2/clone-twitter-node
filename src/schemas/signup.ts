import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ message: "Nome é obrigatório" })
    .min(2, "No minímo 2 ou mais caracteres"),
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(4, "No mínimo 4 ou mais caracteres"),
});
