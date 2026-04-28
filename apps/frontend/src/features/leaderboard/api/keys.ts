import type { LeaderboardDifficulty } from "@/features/leaderboard/types";

export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: (gameId: string, difficulty: LeaderboardDifficulty, limit = 20) =>
    ["leaderboard", gameId, difficulty, limit] as const,
};
