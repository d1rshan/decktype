import type { WithId } from "mongodb";
import type { FeedbackDocument } from "../../db/collections";

export const serializeFeedback = (doc: WithId<FeedbackDocument>) => {
  return {
    id: doc._id.toString(),
    content: doc.content,
    userId: doc.userId.toString(),
    username: doc.username,
    upvotedBy: doc.upvotedBy.map((userId) => userId.toString()),
    downvotedBy: doc.downvotedBy.map((userId) => userId.toString()),
    createdAt: doc.createdAt,
  };
};
