import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { api, unwrapEdenResponse } from '../../../lib/api/client'

export type CreateResultInput = {
  gameId: string
  score: number
  difficulty: string
}

type MyResultsResponse = Awaited<ReturnType<typeof api.api.results.me.get>>

export type ResultHistoryItem = NonNullable<MyResultsResponse['data']>[number]

export const resultKeys = {
  all: ['results'] as const,
  mine: (gameId?: string, limit = 20) =>
    ['results', 'mine', gameId ?? 'all', limit] as const,
}

const fetchMyResults = async (gameId?: string, limit = 20) => {
  const response = await api.api.results.me.get({
    $query: {
      ...(gameId ? { gameId } : {}),
      limit,
    },
    $headers: {},
  })

  return unwrapEdenResponse(response)
}

const createResult = async (input: CreateResultInput) => {
  const response = await api.api.results.post({
    ...input,
    $query: {},
    $headers: {},
  })

  return unwrapEdenResponse(response)
}

export const useMyResultsQuery = (options: {
  enabled?: Accessor<boolean>
  gameId?: Accessor<string | undefined>
  limit?: Accessor<number | undefined>
} = {}) =>
  useQuery(() => {
    const gameId = options.gameId?.()
    const limit = options.limit?.() ?? 20

    return {
      queryKey: resultKeys.mine(gameId, limit),
      queryFn: () => fetchMyResults(gameId, limit),
      enabled: options.enabled?.() ?? true,
    }
  })

export const useCreateResultMutation = () => {
  const client = useQueryClient()

  return useMutation(() => ({
    mutationFn: createResult,
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: resultKeys.all,
      }),
  }))
}
