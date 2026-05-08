import { t } from "elysia";

export const usersCountResponseSchema = t.Object({
  count: t.Number(),
});

export const adminUserResponseSchema = t.Array(
  t.Object({
    id: t.String(),
    username: t.String(),
    email: t.String(),
    createdAt: t.Date(),
  }),
);

export const deleteFeedbackParamsSchema = t.Object({
  id: t.String(),
});

export const deleteFeedbackResponseSchema = t.Object({
  ok: t.Boolean(),
});
