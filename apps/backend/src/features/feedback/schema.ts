import { t } from "elysia";

import { MongoIdString } from "../../lib/object-id";

export const createFeedbackBodySchema = t.Object({
  content: t.String({ minLength: 1, maxLength: 2000 }),
});

export const feedbackParamsSchema = t.Object({
  id: MongoIdString,
});

export const feedbackResponseSchema = t.Object({
  id: t.String(),
  content: t.String(),
  userId: t.String(),
  userDisplayName: t.String(),
  upvotedBy: t.Array(t.String()),
  downvotedBy: t.Array(t.String()),
  createdAt: t.Date(),
});
