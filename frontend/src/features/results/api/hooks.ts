import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import {
  createResultMutationOptions,
  myResultsQueryOptions,
  resultKeys,
} from './options'

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
      ...myResultsQueryOptions(gameId, limit),
      enabled: options.enabled?.() ?? true,
    }
  })

export const useCreateResultMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    ...createResultMutationOptions(),
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: resultKeys.all,
      }),
  }))
}
