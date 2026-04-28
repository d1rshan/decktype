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
          userId: parseObjectId(user.id),
          gameId: body.gameId,
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
        userId: parseObjectId(user.id),
        gameId: query.gameId,
        limit: query.limit ?? 20,
      });
    },
    {
      query: myResultsQuerySchema,
      response: t.Array(resultResponseSchema),
    },
  );
