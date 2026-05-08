import { Elysia, t } from "elysia";

import { parseObjectId } from "../../lib/object-id";
import { requireSession } from "../auth/session";
import {
  changeUsernameBodySchema,
  createResultBodySchema,
  createResultResponseSchema,
  myResultsQuerySchema,
  resultResponseSchema,
  userPBsResponseSchema,
} from "./schema";
import {
  changeUsername,
  createResult,
  getUserPBs,
  getUserResults,
} from "./service";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  .patch(
    "/username",
    async ({ body, request: { headers } }) => {
      const { user } = await requireSession(headers);

      return changeUsername(parseObjectId(user.id), body.username);
    },
    {
      body: changeUsernameBodySchema,
    },
  )
  .post(
    "/results",
    async ({ body, request: { headers } }) => {
      const { user } = await requireSession(headers);

      return createResult(
        {
          userId: parseObjectId(user.id),
          gameId: body.gameId,
          score: body.score,
          difficulty: body.difficulty,
        },
        { username: user.displayUsername },
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
