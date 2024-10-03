import { z } from "zod";

export const searchSchema = z.object({
  q: z.string({ message: "Preencha a busca" }).min(2, "No minimo 2 caracteres"),
  page: z.coerce.number().min(0).optional(),
});
