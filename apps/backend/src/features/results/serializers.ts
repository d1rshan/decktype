import type { WithId } from 'mongodb'
import type { ResultDocument } from '../../db/collections'

export const serializeResult = (doc: WithId<ResultDocument>) => {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    gameId: doc.gameId.toString(),
    score: doc.score,
    difficulty: doc.difficulty,
    createdAt: doc.createdAt,
  }
}
