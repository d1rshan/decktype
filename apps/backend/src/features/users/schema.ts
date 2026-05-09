import { t } from "elysia";

const resultSchema = t.Object({
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

export const changeUsernameBodySchema = t.Object({
  username: t.String({
    minLength: 3,
    maxLength: 30,
    pattern: "^[A-Za-z0-9_]+$",
    error:
      "Username must be 3-30 characters and contain only letters, numbers, and underscores.",
  }),
});

export const createResultResponseSchema = t.Object({
  ...resultSchema.properties,
  isNewPB: t.Boolean(),
});

export const resultResponseSchema = resultSchema;

export const publicProfileParamsSchema = t.Object({
  username: t.String(),
});

const userPBsSchema = t.Record(
  t.String(),
  t.Object({
    easy: t.Optional(t.Object({ bestScore: t.Number(), createdAt: t.Date() })),
    medium: t.Optional(
      t.Object({ bestScore: t.Number(), createdAt: t.Date() }),
    ),
    hard: t.Optional(t.Object({ bestScore: t.Number(), createdAt: t.Date() })),
  }),
);

export const publicProfileResponseSchema = t.Object({
  user: t.Object({
    id: t.String(),
    username: t.String(),
    image: t.Optional(t.String()),
    createdAt: t.Date(),
  }),
  pbs: userPBsSchema,
  results: t.Array(resultResponseSchema),
});
