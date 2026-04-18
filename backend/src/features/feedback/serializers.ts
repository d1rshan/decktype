import type { WithId } from 'mongodb'
import type { FeedbackDocument } from '../../db/collections'

export const serializeFeedback = (doc: WithId<FeedbackDocument>) => {
  return {
    id: doc._id,
    content: doc.content,
    userId: doc.userId,
    userDisplayName: doc.userDisplayName,
    upvotedBy: doc.upvotedBy,
    downvotedBy: doc.downvotedBy,
    createdAt: doc.createdAt,
  }
}
