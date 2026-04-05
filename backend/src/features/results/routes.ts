import { Elysia, t } from 'elysia'

import {
  createResultBodySchema,
  myResultsQuerySchema,
  resultResponseSchema,
} from './schema'
import { requireSession } from '../auth/session'
import { createResult, getUserResults } from './service'

export const resultRoutes = new Elysia({ prefix: '/api/results' })
  .post(
    '/',
    async ({ body, request: { headers }, set }) => {
      const { user } = await requireSession(headers)
      const displayName = user.name?.trim() || user.email || user.id

      const result = await createResult(
        {
          userId: user.id,
          gameId: body.gameId,
          score: body.score,
          difficulty: body.difficulty,
        },
        { displayName },
      )

      set.status = 201

      return result
    },
    {
      body: createResultBodySchema,
      response: {
        201: resultResponseSchema,
      },
    },
  )
  .get(
    '/me',
    async ({ request: { headers }, query }) => {
      const { user } = await requireSession(headers)

      return getUserResults({
        userId: user.id,
        gameId: query.gameId,
        limit: query.limit ?? 20,
      })
    },
    {
      query: myResultsQuerySchema,
      response: t.Array(resultResponseSchema),
    },
  )
