import { leaderboardCollection } from '../../db/collections'
import type { ListLeaderboardFilters } from './schema'

export const upsertLeaderboardEntry = async (input: {
  userId: string
  displayName: string
  gameId: string
  difficulty: string
  score: number
  resultCreatedAt: Date
}) => {
  const query = {
    userId: input.userId,
    gameId: input.gameId,
    difficulty: input.difficulty,
  }

  const existingEntry = await leaderboardCollection.findOne(query)

  if (!existingEntry) {
    await leaderboardCollection.insertOne({
      ...query,
      displayName: input.displayName,
      bestScore: input.score,
      bestResultAt: input.resultCreatedAt,
    })

    return
  }

  const hasBetterScore = input.score > existingEntry.bestScore
  const hasEarlierTieBreak =
    input.score === existingEntry.bestScore &&
    input.resultCreatedAt < existingEntry.bestResultAt
  const hasDisplayNameChange = input.displayName !== existingEntry.displayName

  if (!hasBetterScore && !hasEarlierTieBreak && !hasDisplayNameChange) {
    return
  }

  await leaderboardCollection.updateOne(query, {
    $set: {
      ...(hasBetterScore || hasEarlierTieBreak
        ? {
            bestScore: input.score,
            bestResultAt: input.resultCreatedAt,
          }
        : {}),
      ...(hasDisplayNameChange ? { displayName: input.displayName } : {}),
    },
  })
}

export const findLeaderboardEntries = async (filters: ListLeaderboardFilters) =>
  leaderboardCollection
    .find(
      {
        gameId: filters.gameId,
        ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
      },
      {
        sort: {
          bestScore: -1,
          bestResultAt: 1,
        },
        limit: filters.limit,
      },
    )
    .toArray()
