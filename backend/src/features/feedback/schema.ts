import { t } from 'elysia'
import { ObjectId } from 'mongodb'
import { TObjectId } from '../../lib/object-id'

export type CreateFeedbackInput = {
  content: string
  userId: ObjectId
  userDisplayName: string
}

export type VoteFeedbackInput = {
  feedbackId: string
  userId: ObjectId
}

export const createFeedbackBodySchema = t.Object({
  content: t.String({ minLength: 1, maxLength: 2000 }),
})

export const feedbackResponseSchema = t.Object({
  id: TObjectId,
  content: t.String(),
  userId: TObjectId,
  userDisplayName: t.String(),
  upvotedBy: t.Array(TObjectId),
  downvotedBy: t.Array(TObjectId),
  createdAt: t.Date(),
})
