import { t } from 'elysia'

export const createResultBodySchema = t.Object({
  gameId: t.String({ minLength: 1 }),
  score: t.Number(),
  difficulty: t.String({ minLength: 1 }),
})

export const myResultsQuerySchema = t.Object({
  gameId: t.Optional(t.String({ minLength: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
})

export const resultResponseSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  gameId: t.String(),
  score: t.Number(),
  difficulty: t.String(),
  createdAt: t.String(),
})
