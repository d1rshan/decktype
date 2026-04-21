import { Elysia, t } from 'elysia'

import {
  leaderboardEntryResponseSchema,
  leaderboardQuerySchema,
} from './schema'
import { getLeaderboard } from './service'

export const leaderboardRoutes = new Elysia({ prefix: '/api/leaderboard' }).get(
  '/',
  async ({ query }) => getLeaderboard({ ...query, limit: query.limit ?? 20 }),
  {
    query: leaderboardQuerySchema,
    response: t.Array(leaderboardEntryResponseSchema),
  },
)
