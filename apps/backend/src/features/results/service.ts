import { ApiError } from "../../lib/errors";
import { recordLeaderboardResult } from "../leaderboard/service";
import { resultsDAL } from "./dal";
import { serializeResult } from "./serializers";
import type {
  CreateResultContext,
  CreateResultInput,
  GetUserResultsInput,
} from "./types";

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
  { displayName }: CreateResultContext,
) => {
  const validationMessage = getResultValidationMessage(
    input.gameId,
    input.difficulty,
    input.score,
  );

  if (validationMessage) {
    throw ApiError.badRequest(validationMessage);
  }

  const doc = await resultsDAL.create({
    ...input,
    createdAt: new Date(),
  });

  const isNewPB = await recordLeaderboardResult({
    userId: doc.userId,
    gameId: doc.gameId,
    difficulty: doc.difficulty,
    bestScore: doc.score,
    displayName,
    createdAt: doc.createdAt,
  });

  return {
    ...serializeResult(doc),
    isNewPB,
  };
};

export const getUserResults = async (filters: GetUserResultsInput) => {
  const docs = await resultsDAL.findByUser(filters);
  return docs.map(serializeResult);
};
