import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";

import type { Feedback } from "@/features/feedback/types";
import { api, toastApiError, unwrap } from "@/lib/api-client";

import { feedbackKeys } from "./keys";

export const useFeedbackQuery = (options: { enabled?: () => boolean } = {}) =>
  useQuery(() => ({
    queryKey: feedbackKeys.all,
    queryFn: () => unwrap(api.feedback.get()),
    enabled: options.enabled?.() ?? true,
  }));

export const useCreateFeedbackMutation = () => {
  const client = useQueryClient();
  return useMutation(() => ({
    mutationFn: (input: Parameters<typeof api.feedback.post>[0]) =>
      unwrap(api.feedback.post(input)),
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: feedbackKeys.all });
    },
    onError: (error) => {
      toastApiError(error);
    },
  }));
};

export const useUpvoteFeedbackMutation = (
  getUserId: () => string | undefined,
) => {
  const client = useQueryClient();
  return useMutation(() => ({
    mutationFn: (id: string) => unwrap(api.feedback({ id }).upvote.post()),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: feedbackKeys.all });

      const previous = client.getQueryData<Feedback[]>(feedbackKeys.all);
      const activeUserId = getUserId();

      if (!activeUserId) {
        return { previous };
      }

      client.setQueryData<Feedback[]>(feedbackKeys.all, (current) => {
        if (!current) return current;

        return current.map((item) => {
          if (item.id !== id) return item;

          const hasUpvoted = item.upvotedBy.includes(activeUserId);
          const nextUpvotedBy = hasUpvoted
            ? item.upvotedBy.filter((userId) => userId !== activeUserId)
            : [...item.upvotedBy, activeUserId];

          return {
            ...item,
            upvotedBy: nextUpvotedBy,
            downvotedBy: item.downvotedBy.filter(
              (userId) => userId !== activeUserId,
            ),
          };
        });
      });

      return { previous };
    },
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: feedbackKeys.all });
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        client.setQueryData(feedbackKeys.all, context.previous);
      }
      toastApiError(error);
    },
  }));
};

export const useDownvoteFeedbackMutation = (
  getUserId: () => string | undefined,
) => {
  const client = useQueryClient();
  return useMutation(() => ({
    mutationFn: (id: string) => unwrap(api.feedback({ id }).downvote.post()),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: feedbackKeys.all });

      const previous = client.getQueryData<Feedback[]>(feedbackKeys.all);
      const activeUserId = getUserId();

      if (!activeUserId) {
        return { previous };
      }

      client.setQueryData<Feedback[]>(feedbackKeys.all, (current) => {
        if (!current) return current;

        return current.map((item) => {
          if (item.id !== id) return item;

          const hasDownvoted = item.downvotedBy.includes(activeUserId);
          const nextDownvotedBy = hasDownvoted
            ? item.downvotedBy.filter((userId) => userId !== activeUserId)
            : [...item.downvotedBy, activeUserId];

          return {
            ...item,
            downvotedBy: nextDownvotedBy,
            upvotedBy: item.upvotedBy.filter(
              (userId) => userId !== activeUserId,
            ),
          };
        });
      });

      return { previous };
    },
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: feedbackKeys.all });
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        client.setQueryData(feedbackKeys.all, context.previous);
      }
      toastApiError(error);
    },
  }));
};
