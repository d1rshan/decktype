import type { ObjectId } from "mongodb";

import { resultsCollection } from "../../db/collections";
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
}

export const usersDAL = new UsersDAL();
