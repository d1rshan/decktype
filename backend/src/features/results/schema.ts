import { t } from 'elysia'

export type CreateResultInput = {
  userId: string
  gameId: string
  score: number
  difficulty: string
}

export type ListUserResultsFilters = {
  userId: string
  gameId?: string
  limit: number
}

export type ResultResponse = {
  id: string
  userId: string
  gameId: string
  score: number
  difficulty: string
  createdAt: string
}

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
