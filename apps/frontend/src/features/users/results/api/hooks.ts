import { useMutation, useQueryClient } from "@tanstack/solid-query";

import { api, toastApiError, unwrap } from "@/lib/api-client";
import { toast } from "@/lib/toast";

import { resultKeys } from "./keys";

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
