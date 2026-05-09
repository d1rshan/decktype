import { Elysia } from "elysia";

import { parseObjectId } from "../../lib/object-id";
import { requireSession } from "../auth/session";
import {
  changeUsernameBodySchema,
  createResultBodySchema,
  createResultResponseSchema,
  publicProfileParamsSchema,
  publicProfileResponseSchema,
} from "./schema";
import { changeUsername, createResult, getPublicProfile } from "./service";

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
  .get(
    "/profile/:username",
    async ({ params }) => {
      return getPublicProfile(params.username);
    },
    {
      params: publicProfileParamsSchema,
      response: publicProfileResponseSchema,
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
  );
