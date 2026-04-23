import { ObjectId } from "mongodb";
import { feedbackCollection } from "../../db/collections";
import type { FeedbackDocument } from "../../db/collections";

export class FeedbackDAL {
  async create(data: FeedbackDocument) {
    const res = await feedbackCollection.insertOne(data);
    return {
      _id: res.insertedId,
      ...data,
    };
  }

  async findMany(limit = 50) {
    return feedbackCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async updateVotes(id: ObjectId, userId: ObjectId, type: "up" | "down") {
    const isUpvote = type === "up";
    const targetField = isUpvote ? "upvotedBy" : "downvotedBy";
    const oppositeField = isUpvote ? "downvotedBy" : "upvotedBy";

    const res = await feedbackCollection.findOneAndUpdate(
      { _id: id },
      [
        {
          $set: {
            [targetField]: {
              $cond: [
                { $in: [userId, `$${targetField}`] },
                { $setDifference: [`$${targetField}`, [userId]] },
                { $concatArrays: [`$${targetField}`, [userId]] },
              ],
            },
            [oppositeField]: {
              $setDifference: [`$${oppositeField}`, [userId]],
            },
          },
        },
      ] as any,
      { returnDocument: "after" },
    );

    return res;
  }

  async delete(id: ObjectId) {
    const result = await feedbackCollection.deleteOne({
      _id: id,
    });
    return result.deletedCount > 0;
  }
}

export const feedbackDAL = new FeedbackDAL();
