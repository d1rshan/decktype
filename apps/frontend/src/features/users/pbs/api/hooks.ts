import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

import { api, unwrap } from "@/lib/api-client";

import { pbsKeys } from "./keys";

export const usePersonalBestsQuery = (
  options: { enabled?: Accessor<boolean> } = {},
) =>
  useQuery(() => ({
    queryKey: [...pbsKeys.all] as const,
    queryFn: () => unwrap(api.users.results.pbs.get()),
    enabled: options.enabled?.() ?? true,
  }));
