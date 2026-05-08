import type { WithId } from "mongodb";
import type { LeaderboardDocument } from "../../db/collections";

export const serializeLeaderboardEntry = (doc: WithId<LeaderboardDocument>) => {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    username: doc.username,
    gameId: doc.gameId,
    difficulty: doc.difficulty,
    bestScore: doc.bestScore,
    createdAt: doc.createdAt,
  };
};
