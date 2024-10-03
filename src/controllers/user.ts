import { Response } from "express";
import {
  checkIfFollows,
  findUserBySlug,
  follow,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
  unfollow,
  updateUserInfo,
} from "../services/user";
import { ExtendedRequest } from "../types/extended-request";
import { userTweetSchema } from "../schemas/user-tweets";
import { findTweetsByUser } from "../services/tweet";
import { updateUserSchema } from "../schemas/update-user";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const user = await findUserBySlug(slug);

  if (!user) {
    return res.json({ error: "Usuário não encontrado" });
  }
  const followingCount = await getUserFollowingCount(user.slug);
  const followersCount = await getUserFollowersCount(user.slug);
  const tweetCount = await getUserTweetCount(user.slug);

  res.json({ user, followersCount, followingCount, tweetCount });
};

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const safeData = userTweetSchema.safeParse(req.query);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  let perPage = 5;
  let currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByUser(slug, currentPage, perPage);

  return res.json({ tweets, page: currentPage });
};

export const followToggle = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;
  const me = req.userSlug as string;

  const hasUserToBeFollowed = await findUserBySlug(slug);
  if (!hasUserToBeFollowed) {
    return res.json({ error: "Usuário inexistente" });
  }

  const follows = await checkIfFollows(me, slug);
  if (!follows) {
    await follow(me, slug);
    res.json({ following: true });
  } else {
    await unfollow(me, slug);
    res.json({ following: false });
  }
};

export const updateUser = async (req: ExtendedRequest, res: Response) => {
  const safeData = updateUserSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  await updateUserInfo(req.userSlug as string, safeData.data);

  return res.json({});
};
