import type { WithId } from 'mongodb'
import type { ResultDocument } from '../../db/collections'

export const serializeResult = (doc: WithId<ResultDocument>) => {
  return {
    id: doc._id,
    userId: doc.userId,
    gameId: doc.gameId,
    score: doc.score,
    difficulty: doc.difficulty,
    createdAt: doc.createdAt,
  }
}
