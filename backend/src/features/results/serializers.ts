import type { ObjectId, WithId } from 'mongodb'

import type { ResultDocument } from '../../db/collections'
import type { ResultResponse } from './schema'

export const serializeGameResult = (
  result: WithId<ResultDocument> | (ResultDocument & { _id: ObjectId }),
): ResultResponse => ({
  id: result._id.toString(),
  userId: result.userId,
  gameId: result.gameId,
  score: result.score,
  difficulty: result.difficulty,
  createdAt: result.createdAt.toISOString(),
})
