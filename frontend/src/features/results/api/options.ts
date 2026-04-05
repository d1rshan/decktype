import { api, request } from '@/lib/api-client'

import type { CreateResultInput } from './contract'

export const resultKeys = {
  all: ['results'] as const,
  mine: (gameId?: string, limit = 20) =>
    ['results', 'mine', gameId ?? 'all', limit] as const,
}

export const myResultsQueryOptions = (gameId?: string, limit = 20) => ({
  queryKey: resultKeys.mine(gameId, limit),
  queryFn: () =>
    request(
      api.results.me.get({
      $query: {
        ...(gameId ? { gameId } : {}),
        limit,
      },
      }),
    ),
})

export const createResultMutationOptions = () => ({
  mutationFn: (input: CreateResultInput) =>
    request(api.results.post(input)),
})
