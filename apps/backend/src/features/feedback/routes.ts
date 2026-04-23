import { Elysia, t } from "elysia";

import { parseObjectId } from "../../lib/object-id";
import {
  createFeedbackBodySchema,
  feedbackParamsSchema,
  feedbackResponseSchema,
} from "./schema";
import {
  submitFeedback,
  listFeedback,
  upvoteFeedback,
  downvoteFeedback,
} from "./service";
import { requireSession } from "../auth/session";

export const feedbackRoutes = new Elysia({ prefix: "/api/feedback" })
  .get(
    "/",
    async () => {
      return listFeedback();
    },
    {
      response: t.Array(feedbackResponseSchema),
    },
  )
  .post(
    "/",
    async ({ body, request: { headers } }) => {
      const { user } = await requireSession(headers);

      return submitFeedback({
        content: body.content,
        userId: user.id,
        userDisplayName: user.name,
      });
    },
    {
      body: createFeedbackBodySchema,
      response: feedbackResponseSchema,
    },
  )
  .post(
    "/:id/upvote",
    async ({ params: { id }, request: { headers } }) => {
      const { user } = await requireSession(headers);

      return upvoteFeedback({
        feedbackId: parseObjectId(id, "feedback id"),
        userId: user.id,
      });
    },
    {
      params: feedbackParamsSchema,
      response: feedbackResponseSchema,
    },
  )
  .post(
    "/:id/downvote",
    async ({ params: { id }, request: { headers } }) => {
      const { user } = await requireSession(headers);

      return downvoteFeedback({
        feedbackId: parseObjectId(id, "feedback id"),
        userId: user.id,
      });
    },
    {
      params: feedbackParamsSchema,
      response: feedbackResponseSchema,
    },
  );
