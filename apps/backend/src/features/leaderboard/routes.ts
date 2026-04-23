import { Elysia, t } from "elysia";

import { parseObjectId } from "../../lib/object-id";
import {
  leaderboardEntryResponseSchema,
  leaderboardQuerySchema,
} from "./schema";
import { getLeaderboard } from "./service";

export const leaderboardRoutes = new Elysia({ prefix: "/api/leaderboard" }).get(
  "/",
  async ({ query }) =>
    getLeaderboard({
      gameId: parseObjectId(query.gameId, "gameId"),
      difficulty: query.difficulty,
      limit: query.limit ?? 20,
    }),
  {
    query: leaderboardQuerySchema,
    response: t.Array(leaderboardEntryResponseSchema),
  },
);
