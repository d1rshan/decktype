import type { ObjectId } from "mongodb";

import { leaderboardCollection } from "../../db/collections";
import type { LeaderboardDocument } from "../../db/collections";

export class LeaderboardDAL {
  async upsert(doc: LeaderboardDocument) {
    const query = {
      userId: doc.userId,
      gameId: doc.gameId,
      difficulty: doc.difficulty,
    };

    const res = await leaderboardCollection.updateOne(
      {
        ...query,
        $or: [
          { bestScore: { $lt: doc.bestScore } },
          { bestScore: doc.bestScore, createdAt: { $gt: doc.createdAt } },
        ],
      },
      {
        $set: {
          bestScore: doc.bestScore,
          createdAt: doc.createdAt,
          displayName: doc.displayName,
        },
      },
    );

    if (res.modifiedCount > 0) return true;

    const existing = await leaderboardCollection.findOne(query);
    if (!existing) {
      try {
        await leaderboardCollection.insertOne(doc);
        return true;
      } catch (e: any) {
        if (e.code === 11000) return false;
        throw e;
      }
    }

    return false;
  }

  async find(filters: { gameId: string; difficulty?: string; limit: number }) {
    return leaderboardCollection
      .find(
        {
          gameId: filters.gameId,
          ...(filters.difficulty && { difficulty: filters.difficulty }),
        },
        { sort: { bestScore: -1, createdAt: 1 }, limit: filters.limit },
      )
      .toArray();
  }

  async findByUserId(userId: ObjectId) {
    return leaderboardCollection.find({ userId }).toArray();
  }
}

export const leaderboardDAL = new LeaderboardDAL();
