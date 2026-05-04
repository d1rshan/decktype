import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

import { api, unwrap } from "@/lib/api-client";

import { resultKeys } from "./keys";

export const usePersonalBestsQuery = (
  options: { enabled?: Accessor<boolean> } = {},
) =>
  useQuery(() => ({
    queryKey: [...resultKeys.all, "pbs"] as const,
    queryFn: () => unwrap(api.users.results.pbs.get()),
    enabled: options.enabled?.() ?? true,
  }));

export const userPBsKeys = {
  all: ["userPBs"] as const,
};
