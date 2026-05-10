import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

import { api, unwrap } from "@/lib/api-client";

import { profileKeys } from "./keys";

export const usePublicProfileQuery = (
  username: Accessor<string>,
  options: { enabled?: Accessor<boolean> } = {},
) =>
  useQuery(() => ({
    queryKey: profileKeys.username(username()),
    queryFn: () => unwrap(api.users.profile({ username: username() }).get()),
    enabled: (options.enabled?.() ?? true) && Boolean(username()),
    retry: false,
  }));
