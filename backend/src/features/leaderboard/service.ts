import {
  findLeaderboardEntries,
  upsertLeaderboardEntry,
} from './repository'
import { serializeLeaderboardEntry } from './serializers'
import type { ListLeaderboardFilters } from './schema'

export const recordLeaderboardResult = async (input: {
  userId: string
  displayName: string
  gameId: string
  difficulty: string
  score: number
  resultCreatedAt: Date
}) => upsertLeaderboardEntry(input)

export const getLeaderboard = async (filters: ListLeaderboardFilters) => {
  const entries = await findLeaderboardEntries(filters)

  return entries.map((entry, index) => serializeLeaderboardEntry(entry, index + 1))
}
