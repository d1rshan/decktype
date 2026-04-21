import type { ObjectId } from 'mongodb'
import { leaderboardDAL } from './dal'
import { serializeLeaderboardEntry } from './serializers'

export const recordLeaderboardResult = async (input: {
  userId: ObjectId
  displayName: string
  gameId: ObjectId
  difficulty: string
  bestScore: number
  createdAt: Date
}) => leaderboardDAL.upsert(input)

export const getLeaderboard = async (filters: {
  gameId: ObjectId
  difficulty?: string
  limit: number
}) => {
  const docs = await leaderboardDAL.find(filters)

  return docs.map((doc, index) => ({
    rank: index + 1,
    ...serializeLeaderboardEntry(doc),
  }))
}
