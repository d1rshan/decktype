import { t } from "elysia";

import { MongoIdString } from "../../lib/object-id";

export const usersCountResponseSchema = t.Object({
  count: t.Number(),
});

export const adminUserResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  createdAt: t.Date(),
});

export const deleteFeedbackParamsSchema = t.Object({
  id: MongoIdString,
});

export const deleteFeedbackResponseSchema = t.Object({
  ok: t.Boolean(),
});
