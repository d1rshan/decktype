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

// PBS
type PBEntry = {
  bestScore: number;
  createdAt: Date;
};

export type PBsByGame = Record<string, Record<string, PBEntry>>;

// it will look like dis
// {
//   "falling-words": {
//     "easy": { bestScore: 45, createdAt: Date },
//     "medium": { bestScore: 30, createdAt: Date },
//     "hard": { bestScore: 20, createdAt: Date }
//   }
// }
