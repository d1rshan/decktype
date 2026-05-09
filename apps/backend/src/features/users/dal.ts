import type { ObjectId } from "mongodb";

import {
  feedbackCollection,
  leaderboardCollection,
  resultsCollection,
  usersCollection,
} from "../../db/collections";
import type { ResultDocument } from "../../db/collections";

export class UsersDAL {
  async createResult(doc: ResultDocument) {
    const res = await resultsCollection.insertOne(doc);
    return {
      _id: res.insertedId,
      ...doc,
    };
  }

  async findResultsByUser(filters: {
    userId: ObjectId;
    gameId?: string;
    limit: number;
  }) {
    return resultsCollection
      .find(
        {
          userId: filters.userId,
          ...(filters.gameId && { gameId: filters.gameId }),
        },
        { sort: { createdAt: -1 }, limit: filters.limit },
      )
      .toArray();
  }

  findUserById(userId: ObjectId) {
    return usersCollection.findOne({ _id: userId });
  }

  findUserByUsername(username: string) {
    return usersCollection.findOne({
      username,
    });
  }

  findOtherUserByUsername(username: string, excludedUserId: ObjectId) {
    return usersCollection.findOne({
      username,
      _id: { $ne: excludedUserId },
    });
  }

  changeUsernameIfEligible(input: {
    userId: ObjectId;
    normalizedUsername: string;
    displayUsername: string;
    cooldownCutoff: Date;
    now: Date;
  }) {
    return usersCollection.findOneAndUpdate(
      {
        _id: input.userId,
        displayUsername: { $ne: input.displayUsername },
        $or: [
          { usernameLastChangedAt: { $exists: false } },
          { usernameLastChangedAt: { $lte: input.cooldownCutoff } },
        ],
      },
      {
        $set: {
          username: input.normalizedUsername,
          displayUsername: input.displayUsername,
          usernameLastChangedAt: input.now,
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  syncUsernameReferences(userId: ObjectId, username: string) {
    return Promise.all([
      leaderboardCollection.updateMany({ userId }, { $set: { username } }),
      feedbackCollection.updateMany({ userId }, { $set: { username } }),
    ]);
  }
}

export const usersDAL = new UsersDAL();
