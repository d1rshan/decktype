import type { ObjectId } from "mongodb";

import {
  feedbackCollection,
  leaderboardCollection,
  usersCollection,
} from "../../db/collections";
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
  const user = await usersCollection.findOne({ _id: userId });

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  // Enforce 7 day limit
  if (user.usernameLastChangedAt) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (user.usernameLastChangedAt > sevenDaysAgo) {
      const nextAvailableDate = new Date(user.usernameLastChangedAt);
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
      throw ApiError.badRequest(
        `You can only change your username once every 7 days. Next change available after ${nextAvailableDate.toLocaleDateString()}.`,
      );
    }
  }

  // Check if username taken
  const existingUser = await usersCollection.findOne({
    username: newUsername.toLowerCase(),
    _id: { $ne: userId },
  });

  if (existingUser) {
    throw ApiError.badRequest("Username is already taken.");
  }

  // Update user
  await usersCollection.updateOne(
    { _id: userId },
    {
      $set: {
        username: newUsername.toLowerCase(),
        displayUsername: newUsername,
        usernameLastChangedAt: new Date(),
      },
    },
  );

  // Sync with other collections
  // TODO: Use a transaction if possible/necessary
  await Promise.all([
    leaderboardCollection.updateMany(
      { userId },
      { $set: { username: newUsername } },
    ),
    feedbackCollection.updateMany(
      { userId },
      { $set: { username: newUsername } },
    ),
  ]);

  return { success: true };
};

// TODO: Make the result write and leaderboard update atomic.
// usersDAL.createResult() persists the result before recordLeaderboardResult() runs.
// If the leaderboard update fails, the API will error after the result has already been stored, and retries can create duplicate results or an inconsistent PB state.
