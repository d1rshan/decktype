import type { ObjectId } from 'mongodb';
import { recordLeaderboardResult } from '../leaderboard/service'
import { resultsDAL } from './dal'
import { serializeResult } from './serializers'

export const createResult = async (
  input: { userId: ObjectId; gameId: ObjectId; score: number; difficulty: string },
  { displayName }: { displayName: string },
) => {
  const doc = await resultsDAL.create({
    ...input,
    createdAt: new Date(),
  })

  const isNewPB = await recordLeaderboardResult({
    userId: doc.userId,
    gameId: doc.gameId,
    difficulty: doc.difficulty,
    bestScore: doc.score,
    displayName,
    createdAt: doc.createdAt,
  })

  return {
    ...serializeResult(doc),
    isNewPB,
  }
}

export const getUserResults = async (filters: {
  userId: ObjectId
  gameId?: ObjectId
  limit: number
}) => {
  const docs = await resultsDAL.findByUser(filters)
  return docs.map(serializeResult)
}
