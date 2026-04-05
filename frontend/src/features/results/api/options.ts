import { api, unwrapEdenResponse } from '@/lib/api/client'

import type { CreateResultInput } from './contract'

export const resultKeys = {
  all: ['results'] as const,
  mine: (gameId?: string, limit = 20) =>
    ['results', 'mine', gameId ?? 'all', limit] as const,
}

export const myResultsQueryOptions = (gameId?: string, limit = 20) => ({
  queryKey: resultKeys.mine(gameId, limit),
  queryFn: async () => {
    const response = await api.results.me.get({
      $query: {
        ...(gameId ? { gameId } : {}),
        limit,
      },
    })

    return unwrapEdenResponse(response)
  },
})

export const createResultMutationOptions = () => ({
  mutationFn: async (input: CreateResultInput) => {
    const response = await api.results.post(input)

    return unwrapEdenResponse(response)
  },
})
