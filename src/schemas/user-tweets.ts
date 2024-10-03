import { z } from "zod";

export const userTweetSchema = z.object({
  page: z.coerce.number().min(0).optional(),
});

//coerce vai verificar se a string enviada da query é um número. Ex: "5" é válido com o coerce
