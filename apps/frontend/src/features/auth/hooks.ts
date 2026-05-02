import { createMemo } from "solid-js";

import { authClient } from "@/lib/auth-client";

export function useAuthSession() {
  const session = authClient.useSession();

  const user = createMemo(() => session().data?.user ?? null);
  const userId = createMemo(() => user()?.id);
  const displayName = createMemo(() => user()?.name ?? "guest");
  const isAuthenticated = createMemo(() => Boolean(user()));
  const isLoading = createMemo(() => session().isPending);
  const isAdmin = createMemo(
    () => (user() as { admin?: boolean } | null)?.admin === true,
  );

  return {
    session,
    user,
    userId,
    displayName,
    isAuthenticated,
    isLoading,
    isAdmin,
  };
}
