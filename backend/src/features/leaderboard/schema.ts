import { t } from 'elysia'

export type ListLeaderboardFilters = {
  gameId: string
  difficulty?: string
  limit: number
}

export type LeaderboardEntryResponse = {
  rank: number
  userId: string
  displayName: string
  gameId: string
  difficulty: string
  bestScore: number
  bestResultAt: string
}

export const leaderboardQuerySchema = t.Object({
  gameId: t.String({ minLength: 1 }),
  difficulty: t.Optional(t.String({ minLength: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
})

export const leaderboardEntryResponseSchema = t.Object({
  rank: t.Number(),
  userId: t.String(),
  displayName: t.String(),
  gameId: t.String(),
  difficulty: t.String(),
  bestScore: t.Number(),
  bestResultAt: t.String(),
})
