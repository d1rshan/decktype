import { ApiError } from "../../lib/errors";
import { env } from "../../config/env";
import { auth } from "./index";

export const requireSession = async (headers: Headers) => {
  const currentSession = await auth.api.getSession({
    headers,
  });

  if (!currentSession) {
    throw ApiError.unauthorized("You must be signed in.");
  }

  return currentSession;
};

export const requireAdminSession = async (headers: Headers) => {
  const currentSession = await requireSession(headers);
  const userEmail = currentSession.user.email?.trim().toLowerCase();

  if (!userEmail || userEmail !== env.adminEmail) {
    throw ApiError.forbidden(
      "You are not authorized to access admin resources.",
    );
  }

  return currentSession;
};
