import { type Accessor, createMemo } from "solid-js";
import { useAuthSession } from "@/features/auth/hooks";
import {
  formatUsernameChangeTooltip,
  getNextUsernameChangeAvailableAt,
} from "./utils";

export function useUsernameChangeCooldown() {
  const auth = useAuthSession();

  const nextAvailableAt = createMemo(() =>
    getNextUsernameChangeAvailableAt(auth.usernameLastChangedAt()),
  );

  const canChangeUsername = createMemo(() => {
    const next = nextAvailableAt();
    if (!next) return true;
    return next.getTime() <= Date.now();
  });

  const tooltip = createMemo(() => {
    const next = nextAvailableAt();
    if (!next || canChangeUsername()) return undefined;
    return formatUsernameChangeTooltip(next);
  });

  return {
    canChangeUsername,
    tooltip,
  };
}

export function useIsOwnProfile(userId: Accessor<string | undefined>) {
  const auth = useAuthSession();
  return createMemo(() => {
    if (auth.isLoading() || !auth.isAuthenticated()) return false;
    return auth.userId() === userId();
  });
}
