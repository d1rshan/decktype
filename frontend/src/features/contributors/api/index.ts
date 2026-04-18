import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { api, toastApiError, unwrap } from '@/lib/api-client'

export const contributorsKeys = {
  all: ['contributors'] as const,
  list: (limit = 100) => ['contributors', limit] as const,
}

export const useContributorsQuery = (options?: {
  limit?: Accessor<number | undefined>
}) =>
  useQuery(() => {
    const limit = options?.limit?.() ?? 100

    return {
      queryKey: contributorsKeys.list(limit),
      queryFn: () =>
        unwrap(
          api.contributors.get({
            $query: {
              limit,
            },
          }),
        ),
    }
  })

export const useSyncContributorsMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    mutationFn: () => unwrap(api.admin.contributors.sync.post()),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: contributorsKeys.all })
    },
    onError: (error) => {
      toastApiError(error)
    },
  }))
}
