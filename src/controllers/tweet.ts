import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import {
  checkIfTweetIsLikedByUser,
  createTweet,
  findAnswersFromTweet,
  findTweet,
  likeTweet,
  unlikeTweet,
} from "../services/tweet";
import { addHashTag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
    if (!hasAnswerTweet)
      return res.json({ error: "Tweet original inexistente" });
  }

  const newTweet = await createTweet(
    req.userSlug as string,
    safeData.data.body,
    safeData.data.answer ? parseInt(safeData.data.answer) : 0
  );

  const hashTags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
  if (hashTags) {
    for (let hashTag of hashTags) {
      if (hashTag.length >= 2) {
        await addHashTag(hashTag);
      }
    }
  }

  res.json({ tweet: newTweet });
};

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const tweet = await findTweet(parseInt(id));

  if (!tweet) {
    return res.json({ error: "Tweet não existe :(" });
  }

  return res.json({ tweet });
};

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const answers = await findAnswersFromTweet(parseInt(id));

  res.json({ answers });
};

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const liked = await checkIfTweetIsLikedByUser(
    req.userSlug as string,
    parseInt(id)
  );

  if (liked) {
    unlikeTweet(req.userSlug as string, parseInt(id));
  } else {
    likeTweet(req.userSlug as string, parseInt(id));
  }

  res.json({});
};
