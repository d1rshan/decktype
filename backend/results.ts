import { Collection, ObjectId } from 'mongodb'
import type { WithId } from 'mongodb'

import { db } from './db'

export type GameResultDocument = {
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: Date
}

export type GameResultResponse = {
  id: string
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: string
}

export const resultsCollection: Collection<GameResultDocument> =
  db.collection<GameResultDocument>('typing_results')

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

export const ensureResultsIndexes = async () => {
  await resultsCollection.createIndexes([
    {
      key: { userId: 1, createdAt: -1 },
      name: 'user_createdAt_desc',
    },
    {
      key: { gameId: 1, difficulty: 1, score: -1, createdAt: -1 },
      name: 'game_difficulty_score_desc',
    },
  ])
}
