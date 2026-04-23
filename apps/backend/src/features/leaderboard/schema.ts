import { t } from "elysia";

import { MongoIdString } from "../../lib/object-id";

export const leaderboardQuerySchema = t.Object({
  gameId: MongoIdString,
  difficulty: t.Optional(t.String({ minLength: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
});

export const leaderboardEntryResponseSchema = t.Object({
  rank: t.Number(),
  userId: t.String(),
  displayName: t.String(),
  gameId: t.String(),
  difficulty: t.String(),
  bestScore: t.Number(),
  createdAt: t.Date(),
});
