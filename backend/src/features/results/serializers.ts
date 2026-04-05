import type { ObjectId, WithId } from 'mongodb'

import type { GameResultDocument, GameResultResponse } from './types'

export const serializeGameResult = (
  result: WithId<GameResultDocument> | (GameResultDocument & { _id: ObjectId }),
): GameResultResponse => ({
  id: result._id.toString(),
  userId: result.userId,
  gameId: result.gameId,
  score: result.score,
  difficulty: result.difficulty,
  createdAt: result.createdAt.toISOString(),
})
