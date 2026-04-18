import { t } from 'elysia'
import { TObjectId } from '../../lib/object-id'

export const createResultBodySchema = t.Object({
  gameId: TObjectId,
  score: t.Number(),
  difficulty: t.String({ minLength: 1 }),
})

export const myResultsQuerySchema = t.Object({
  gameId: t.Optional(TObjectId),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
})

// Base schema for shared properties
const baseResultSchema = {
  id: TObjectId,
  userId: TObjectId,
  gameId: TObjectId,
  score: t.Number(),
  difficulty: t.String(),
  createdAt: t.Date(),
}

export const resultResponseSchema = t.Object({
  ...baseResultSchema,
})

export const createResultResponseSchema = t.Object({
  ...baseResultSchema,
  isNewPB: t.Boolean(),
})
