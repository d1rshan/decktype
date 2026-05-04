import type { ObjectId } from "mongodb";

import { leaderboardDAL } from "./dal";
import { serializeLeaderboardEntry } from "./serializers";
import type {
  GetLeaderboardInput,
  RecordLeaderboardResultInput,
} from "./types";

export const recordLeaderboardResult = async (
  input: RecordLeaderboardResultInput,
) => leaderboardDAL.upsert(input);

export const getLeaderboard = async (filters: GetLeaderboardInput) => {
  const docs = await leaderboardDAL.find(filters);

  return docs.map((doc, index) => ({
    rank: index + 1,
    ...serializeLeaderboardEntry(doc),
  }));
};

export const getUsersLeaderboardEntries = async (userId: ObjectId) =>
  leaderboardDAL.findByUserId(userId);
