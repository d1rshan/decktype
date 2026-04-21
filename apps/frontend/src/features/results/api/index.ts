import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { api, toastApiError, unwrap } from '@/lib/api-client'
import { toast } from '@/lib/toast'

import type { CreateResultInput } from './contract'

export const resultKeys = {
  all: ['results'] as const,
  mine: (gameId?: string, limit = 20) =>
    ['results', 'mine', gameId ?? 'all', limit] as const,
}

export const useMyResultsQuery = (
  options: {
    enabled?: Accessor<boolean>
    gameId?: Accessor<string | undefined>
    limit?: Accessor<number | undefined>
  } = {},
) =>
  useQuery(() => {
    const gameId = options.gameId?.()
    const limit = options.limit?.() ?? 20

    return {
      queryKey: resultKeys.mine(gameId, limit),
      queryFn: () =>
        unwrap(
          api.results.me.get({
            query: {
              ...(gameId ? { gameId: gameId as any } : {}),
              limit,
            },
          }),
        ),
      enabled: options.enabled?.() ?? true,
    }
  })

export const useCreateResultMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    mutationFn: (input: CreateResultInput) => unwrap(api.results.post(input as any)),
    onSuccess: () => {
      toast.success('Result saved.')

      return client.invalidateQueries({
        queryKey: resultKeys.all,
      })
    },
    onError: (error) => {
      toastApiError(error)
    },
  }))
}
