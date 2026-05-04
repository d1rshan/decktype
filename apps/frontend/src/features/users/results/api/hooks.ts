import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import type { Accessor } from "solid-js";

import { api, toastApiError, unwrap } from "@/lib/api-client";
import { toast } from "@/lib/toast";

import { resultKeys } from "./keys";

export const useMyResultsQuery = (
  options: {
    enabled?: Accessor<boolean>;
    gameId?: Accessor<string | undefined>;
    limit?: Accessor<number | undefined>;
  } = {},
) =>
  useQuery(() => {
    const gameId = options.gameId?.();
    const limit = options.limit?.() ?? 20;

    return {
      queryKey: resultKeys.mine(gameId, limit),
      queryFn: () =>
        unwrap(
          api.users.results.get({
            query: {
              ...(gameId ? { gameId } : {}),
              limit,
            },
          }),
        ),
      enabled: options.enabled?.() ?? true,
    };
  });

export const useCreateResultMutation = () => {
  const client = useQueryClient();

  return useMutation(() => ({
    mutationFn: (input: Parameters<typeof api.users.results.post>[0]) =>
      unwrap(api.users.results.post(input)),
    onSuccess: (data) => {
      if (data.isNewPB) {
        toast.success("New Personal Best!");
      } else {
        toast.success("Result saved.");
      }

      return client.invalidateQueries({
        queryKey: resultKeys.all,
      });
    },
    onError: (error) => {
      toastApiError(error);
    },
  }));
};
