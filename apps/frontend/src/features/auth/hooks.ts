import { createMemo } from "solid-js";

import { authClient } from "@/lib/auth-client";

type AuthSessionUser = {
  id: string;
  displayUsername?: string | null;
  admin?: boolean;
  usernameLastChangedAt?: Date;
} | null;

export function useAuthSession() {
  const session = authClient.useSession();

  const user = createMemo<AuthSessionUser>(() => session().data?.user ?? null);
  const userId = createMemo(() => user()?.id);
  const username = createMemo(() => user()?.displayUsername ?? "guest");
  const usernameLastChangedAt = createMemo(() => user()?.usernameLastChangedAt);
  const isAuthenticated = createMemo(() => Boolean(user()));
  const isLoading = createMemo(() => session().isPending);
  const isAdmin = createMemo(() => user()?.admin === true);

  return {
    session,
    user,
    userId,
    username,
    usernameLastChangedAt,
    isAuthenticated,
    isLoading,
    isAdmin,
  };
}
