import { Response } from "express";
import { getUserSuggestions } from "../services/user";
import { ExtendedRequest } from "../types/extended-request";

export const getSuggestions = async (req: ExtendedRequest, res: Response) => {
  const suggestions = await getUserSuggestions(req.userSlug as string);

  return res.json({ suggestions });
};
