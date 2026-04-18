import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'

import { feedbackKeys } from '@/features/feedback/api'
import { api, toastApiError, unwrap } from '@/lib/api-client'

export const adminKeys = {
  all: ['admin'] as const,
  usersCount: ['admin', 'users-count'] as const,
  usersList: ['admin', 'users-list'] as const,
}

export const useAdminUsersCountQuery = () =>
  useQuery(() => ({
    queryKey: adminKeys.usersCount,
    queryFn: () => unwrap(api.admin.users.count.get()),
    retry: false,
  }))

export const useAdminUsersListQuery = () =>
  useQuery(() => ({
    queryKey: adminKeys.usersList,
    queryFn: () => unwrap(api.admin.users.get()),
    retry: false,
  }))

export const useAdminDeleteFeedbackMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    mutationFn: (id: string) => unwrap(api.admin.feedback[id].delete()),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: feedbackKeys.all })
      void client.invalidateQueries({ queryKey: adminKeys.all })
    },
    onError: (error) => {
      toastApiError(error)
    },
  }))
}
