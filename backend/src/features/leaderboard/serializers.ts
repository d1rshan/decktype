import type { ObjectId, WithId } from 'mongodb'

import type { LeaderboardDocument } from '../../db/collections'
import type { LeaderboardEntryResponse } from './schema'

export const serializeLeaderboardEntry = (
  entry:
    | WithId<LeaderboardDocument>
    | (LeaderboardDocument & { _id: ObjectId }),
  rank: number,
): LeaderboardEntryResponse => ({
  rank,
  userId: entry.userId,
  displayName: entry.displayName,
  gameId: entry.gameId,
  difficulty: entry.difficulty,
  bestScore: entry.bestScore,
  bestResultAt: entry.bestResultAt.toISOString(),
})
