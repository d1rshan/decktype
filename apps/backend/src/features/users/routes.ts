import { Elysia, t } from "elysia";

import { parseObjectId } from "../../lib/object-id";
import { requireSession } from "../auth/session";
import {
  createResultBodySchema,
  createResultResponseSchema,
  myResultsQuerySchema,
  resultResponseSchema,
  userPBsResponseSchema,
} from "./schema";
import { createResult, getUserPBs, getUserResults } from "./service";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .post(
    "/results",
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
    "/results",
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
  )
  .get(
    "/results/pbs",
    async ({ request: { headers } }) => {
      const { user } = await requireSession(headers);

      return getUserPBs(parseObjectId(user.id));
    },
    {
      response: userPBsResponseSchema,
    },
  );
