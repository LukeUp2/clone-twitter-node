import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha é obrigatória" })
    .min(4, "No mínimo 4 ou mais caracteres"),
});
