import { recordLeaderboardResult } from '../leaderboard/service'
import { findResultsByUser, insertResult } from './repository'
import { serializeGameResult } from './serializers'
import type { CreateResultInput, ListUserResultsFilters } from './schema'

export const createResult = async (
  input: CreateResultInput,
  options: { displayName: string },
) => {
  const result = await insertResult(input)

  await recordLeaderboardResult({
    userId: result.userId,
    displayName: options.displayName,
    gameId: result.gameId,
    difficulty: result.difficulty,
    score: result.score,
    resultCreatedAt: result.createdAt,
  })

  return serializeGameResult(result)
}

export const getUserResults = async (filters: ListUserResultsFilters) => {
  const results = await findResultsByUser(filters)

  return results.map(serializeGameResult)
}
