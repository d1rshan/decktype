import { Elysia, t } from "elysia";

import { parseObjectId } from "../../lib/object-id";
import { requireSession } from "../auth/session";

import {
  createResultBodySchema,
  createResultResponseSchema,
  myResultsQuerySchema,
  resultResponseSchema,
} from "./schema";
import { createResult, getUserResults } from "./service";

export const resultRoutes = new Elysia({ prefix: "/api/results" })
  .post(
    "/",
    async ({ body, request: { headers } }) => {
      const { user } = await requireSession(headers);
      const displayName = user.name;

      return createResult(
        {
          userId: user.id,
          gameId: parseObjectId(body.gameId, "gameId"),
          score: body.score,
          difficulty: body.difficulty,
        },
        { displayName },
      );
    },
    {
      body: createResultBodySchema,
      response: createResultResponseSchema,
    },
  )

  .get(
    "/me",
    async ({ request: { headers }, query }) => {
      const { user } = await requireSession(headers);

      return getUserResults({
        userId: user.id,
        gameId: query.gameId
          ? parseObjectId(query.gameId, "gameId")
          : undefined,
        limit: query.limit ?? 20,
      });
    },
    {
      query: myResultsQuerySchema,
      response: t.Array(resultResponseSchema),
    },
  );
