import { t } from "elysia";

export const createFeedbackBodySchema = t.Object({
  content: t.String({ minLength: 1, maxLength: 2000 }),
});

export const feedbackParamsSchema = t.Object({
  id: t.String(),
});

export const feedbackResponseSchema = t.Object({
  id: t.String(),
  content: t.String(),
  userId: t.String(),
  username: t.String(),
  upvotedBy: t.Array(t.String()),
  downvotedBy: t.Array(t.String()),
  createdAt: t.Date(),
});
