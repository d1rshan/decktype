import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import { toastApiError } from '@/lib/api-client'
import type { Feedback } from './contract'
import {
  createFeedbackMutationOptions,
  feedbackQueryOptions,
  feedbackKeys,
  upvoteFeedbackMutationOptions,
  downvoteFeedbackMutationOptions
} from './options'

export const useFeedbackQuery = (options: { enabled?: () => boolean } = {}) =>
  useQuery(() => ({
    ...feedbackQueryOptions(),
    enabled: options.enabled?.() ?? true,
    // refetchInterval: 10000, // Refetch every 10s for chat-like feel
  }))

export const useCreateFeedbackMutation = () => {
  const client = useQueryClient()
  return useMutation(() => ({
    ...createFeedbackMutationOptions(),
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: feedbackKeys.all })
    },
    onError: (error) => {
      toastApiError(error, 'unable to send message.')
    },
  }))
}

export const useUpvoteFeedbackMutation = (getUserId: () => string | undefined) => {
  const client = useQueryClient()
  return useMutation(() => ({
    ...upvoteFeedbackMutationOptions(),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: feedbackKeys.all })

      const previous = client.getQueryData<Feedback[]>(feedbackKeys.all)
      const activeUserId = getUserId()

      if (!activeUserId) {
        return { previous }
      }

      client.setQueryData<Feedback[]>(feedbackKeys.all, (current) => {
        if (!current) return current

        return current.map((item) => {
          if (item.id !== id) return item

          const hasUpvoted = item.upvotedBy.includes(activeUserId)
          const nextUpvotedBy = hasUpvoted
            ? item.upvotedBy.filter((userId) => userId !== activeUserId)
            : [...item.upvotedBy, activeUserId]

          return {
            ...item,
            upvotedBy: nextUpvotedBy,
            downvotedBy: item.downvotedBy.filter((userId) => userId !== activeUserId),
          }
        })
      })

      return { previous }
    },
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: feedbackKeys.all })
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        client.setQueryData(feedbackKeys.all, context.previous)
      }
      toastApiError(error, 'unable to upvote.')
    },
  }))
}

export const useDownvoteFeedbackMutation = (getUserId: () => string | undefined) => {
  const client = useQueryClient()
  return useMutation(() => ({
    ...downvoteFeedbackMutationOptions(),
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: feedbackKeys.all })

      const previous = client.getQueryData<Feedback[]>(feedbackKeys.all)
      const activeUserId = getUserId()

      if (!activeUserId) {
        return { previous }
      }

      client.setQueryData<Feedback[]>(feedbackKeys.all, (current) => {
        if (!current) return current

        return current.map((item) => {
          if (item.id !== id) return item

          const hasDownvoted = item.downvotedBy.includes(activeUserId)
          const nextDownvotedBy = hasDownvoted
            ? item.downvotedBy.filter((userId) => userId !== activeUserId)
            : [...item.downvotedBy, activeUserId]

          return {
            ...item,
            downvotedBy: nextDownvotedBy,
            upvotedBy: item.upvotedBy.filter((userId) => userId !== activeUserId),
          }
        })
      })

      return { previous }
    },
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: feedbackKeys.all })
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        client.setQueryData(feedbackKeys.all, context.previous)
      }
      toastApiError(error, 'unable to downvote.')
    },
  }))
}
