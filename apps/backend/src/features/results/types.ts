import type { ObjectId } from "mongodb";

export type CreateResultInput = {
  userId: ObjectId;
  gameId: string;
  score: number;
  difficulty: string;
};

export type GetUserResultsInput = {
  userId: ObjectId;
  gameId?: string;
  limit: number;
};

export type CreateResultContext = {
  displayName: string;
};
