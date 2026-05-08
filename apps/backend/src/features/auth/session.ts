import { ApiError } from "../../lib/errors";
import { auth } from "./index";
import { type AppSession } from "./types";

export const requireSession = async (headers: Headers): Promise<AppSession> => {
  const currentSession = await auth.api.getSession({
    headers,
  });

  if (!currentSession) {
    throw ApiError.unauthorized("You must be signed in.");
  }

  return currentSession as AppSession;
};

export const requireAdminSession = async (
  headers: Headers,
): Promise<AppSession> => {
  const currentSession = await requireSession(headers);
  const user = currentSession.user as { admin?: boolean };

  if (!user.admin) {
    throw ApiError.forbidden(
      "You are not authorized to access admin resources.",
    );
  }

  return currentSession as AppSession;
};
