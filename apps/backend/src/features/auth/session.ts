import { ApiError } from "../../lib/errors";
import { env } from "../../config/env";
import { auth } from "./auth";
import { ObjectId } from "mongodb";

export const requireSession = async (headers: Headers) => {
  const currentSession = await auth.api.getSession({
    headers,
  });

  if (!currentSession) {
    throw ApiError.unauthorized("You must be signed in.");
  }

  return {
    ...currentSession,
    user: {
      ...currentSession.user,
      id: new ObjectId(currentSession.user.id), // convert once here
    },
  };
};

export const requireAdminSession = async (headers: Headers) => {
  const currentSession = await requireSession(headers);
  const userEmail = currentSession.user.email?.trim().toLowerCase();

  if (!userEmail || !env.adminEmails.includes(userEmail)) {
    throw ApiError.forbidden(
      "You are not authorized to access admin resources.",
    );
  }

  return currentSession;
};
