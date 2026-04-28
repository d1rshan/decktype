import type { ObjectId } from "mongodb";

export type RecordLeaderboardResultInput = {
  userId: ObjectId;
  gameId: string;
  difficulty: string;
  bestScore: number;
  displayName: string;
  createdAt: Date;
};

export type GetLeaderboardInput = {
  gameId: string;
  difficulty?: string;
  limit: number;
};
