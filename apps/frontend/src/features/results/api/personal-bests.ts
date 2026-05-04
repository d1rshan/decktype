import { useQuery } from "@tanstack/solid-query";

import { api, unwrap } from "@/lib/api-client";

import { resultKeys } from "./keys";

export const usePersonalBestsQuery = () =>
  useQuery(() => ({
    queryKey: [...resultKeys.all, "pbs"] as const,
    queryFn: () => unwrap(api.users.results.pbs.get()),
  }));

export const userPBsKeys = {
  all: ["userPBs"] as const,
};
