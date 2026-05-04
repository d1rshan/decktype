import type { WithId } from "mongodb";

import type { LeaderboardDocument, ResultDocument } from "../../db/collections";
import type { PBsByGame } from "./types";

export const serializeResult = (doc: WithId<ResultDocument>) => ({
  id: doc._id.toString(),
  userId: doc.userId.toString(),
  gameId: doc.gameId,
  score: doc.score,
  difficulty: doc.difficulty,
  createdAt: doc.createdAt,
});

// TODO: make all serialzers process docs instead of doc

export const serializeUserPBs = (docs: WithId<LeaderboardDocument>[]) => {
  const pbsByGame: PBsByGame = {};

  for (const { gameId, difficulty, bestScore, createdAt } of docs) {
    pbsByGame[gameId] ??= {};
    pbsByGame[gameId]![difficulty] = { bestScore, createdAt };
  }

  return { pbs: pbsByGame };
};
