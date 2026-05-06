import { useQuery } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

import { api, unwrap } from "@/lib/api-client";

import { profileKeys } from "./keys";

export const usePublicProfileQuery = (username: Accessor<string>) =>
  useQuery(() => ({
    queryKey: profileKeys.username(username()),
    queryFn: () => unwrap(api.users.profile({ username: username() }).get()),
    enabled: !!username(),
  }));
