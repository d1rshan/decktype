import { t } from "elysia";

const baseResultSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  gameId: t.String(),
  score: t.Number(),
  difficulty: t.String(),
  createdAt: t.Date(),
});

export const createResultBodySchema = t.Object({
  gameId: t.String(),
  score: t.Number(),
  difficulty: t.String({ minLength: 1 }),
});

export const createResultResponseSchema = t.Object({
  ...baseResultSchema.properties,
  isNewPB: t.Boolean(),
});

export const resultResponseSchema = baseResultSchema;

export const myResultsQuerySchema = t.Object({
  gameId: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
});

export const userPBsResponseSchema = t.Object({
  pbs: t.Record(
    t.String(),
    t.Object({
      easy: t.Optional(
        t.Object({ bestScore: t.Number(), createdAt: t.Date() }),
      ),
      medium: t.Optional(
        t.Object({ bestScore: t.Number(), createdAt: t.Date() }),
      ),
      hard: t.Optional(
        t.Object({ bestScore: t.Number(), createdAt: t.Date() }),
      ),
    }),
  ),
});
