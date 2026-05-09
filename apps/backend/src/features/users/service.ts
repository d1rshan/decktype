import type { ObjectId } from "mongodb";

import { ApiError } from "../../lib/errors";
import { getUsersLeaderboardEntries } from "../leaderboard/service";
import { recordLeaderboardResult } from "../leaderboard/service";
import { usersDAL } from "./dal";
import { serializeResult, serializeUserPBs } from "./serializers";
import type { CreateResultInput, GetUserResultsInput } from "./types";

// TODO: Move rules and shared configs to a new package
const FALLING_WORDS_MINIMUM_SCORES = {
  easy: 20,
  medium: 15,
  hard: 10,
} as const;

const getResultValidationMessage = (
  gameId: string,
  difficulty: string,
  score: number,
) => {
  if (gameId !== "falling-words") {
    return null;
  }

  const minimumScore =
    FALLING_WORDS_MINIMUM_SCORES[
      difficulty as keyof typeof FALLING_WORDS_MINIMUM_SCORES
    ];

  if (minimumScore === undefined || score >= minimumScore) {
    return null;
  }

  return `Result not saved. Test too short. Minimum score for ${difficulty} is ${minimumScore}.`;
};

export const createResult = async (
  input: CreateResultInput,
  { username }: { username: string },
) => {
  const validationMessage = getResultValidationMessage(
    input.gameId,
    input.difficulty,
    input.score,
  );

  if (validationMessage) {
    throw ApiError.badRequest(validationMessage);
  }

  const doc = await usersDAL.createResult({
    ...input,
    createdAt: new Date(),
  });

  const isNewPB = await recordLeaderboardResult({
    userId: doc.userId,
    gameId: doc.gameId,
    difficulty: doc.difficulty,
    bestScore: doc.score,
    username,
    createdAt: doc.createdAt,
  });

  return {
    ...serializeResult(doc),
    isNewPB,
  };
};

export const getUserResults = async (filters: GetUserResultsInput) => {
  const docs = await usersDAL.findResultsByUser(filters);
  return docs.map(serializeResult);
};

export const getUserPBs = async (userId: ObjectId) => {
  const docs = await getUsersLeaderboardEntries(userId);
  return serializeUserPBs(docs);
};

export const changeUsername = async (userId: ObjectId, newUsername: string) => {
  const normalizedUsername = newUsername.toLowerCase();

  // Check if username taken
  const existingUser = await usersDAL.findOtherUserByUsername(
    normalizedUsername,
    userId,
  );

  if (existingUser) {
    throw ApiError.badRequest("Username is already taken.");
  }

  const now = new Date();
  const cooldownCutoff = new Date(now);
  cooldownCutoff.setDate(cooldownCutoff.getDate() - 7);

  const user = await usersDAL.findUserById(userId);

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  if (user.displayUsername === newUsername) {
    throw ApiError.badRequest("Please choose a different username.");
  }

  if (
    user.usernameLastChangedAt &&
    user.usernameLastChangedAt > cooldownCutoff
  ) {
    const nextAvailableDate = new Date(user.usernameLastChangedAt);
    nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
    throw ApiError.badRequest(
      `You can only change your username once every 7 days. Next change available after ${nextAvailableDate.toLocaleDateString()}.`,
    );
  }

  // Enforce the cooldown at write time to avoid concurrent rename bypasses.
  const guardedUpdate = await usersDAL.changeUsernameIfEligible({
    userId,
    normalizedUsername,
    displayUsername: newUsername,
    cooldownCutoff,
    now,
  });

  if (!guardedUpdate) {
    const freshUser = await usersDAL.findUserById(userId);

    if (!freshUser) {
      throw ApiError.notFound("User not found.");
    }

    if (freshUser.displayUsername === newUsername) {
      throw ApiError.badRequest("Please choose a different username.");
    }

    if (
      freshUser.usernameLastChangedAt &&
      freshUser.usernameLastChangedAt > cooldownCutoff
    ) {
      const nextAvailableDate = new Date(freshUser.usernameLastChangedAt);
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
      throw ApiError.badRequest(
        `You can only change your username once every 7 days. Next change available after ${nextAvailableDate.toLocaleDateString()}.`,
      );
    }

    throw ApiError.badRequest("Unable to update username right now.");
  }

  // Sync with other collections
  await usersDAL.syncUsernameReferences(userId, newUsername);

  return { success: true };
};

export const getPublicProfile = async (username: string) => {
  const normalizedUsername = username.toLowerCase();
  const user = await usersDAL.findUserByUsername(normalizedUsername);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const userId = user._id;
  const { pbs } = await getUserPBs(userId);
  const results = await getUserResults({ userId, limit: 12 });

  return {
    user: {
      id: userId.toString(),
      username: user.displayUsername,
      image: user.image,
      createdAt: user.createdAt,
    },
    pbs,
    results,
  };
};

// TODO: Make the result write and leaderboard update atomic.
// usersDAL.createResult() persists the result before recordLeaderboardResult() runs.
// If the leaderboard update fails, the API will error after the result has already been stored, and retries can create duplicate results or an inconsistent PB state.
