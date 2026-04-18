import { useQuery } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { api, unwrap } from '@/lib/api-client'
import type { LeaderboardDifficulty } from './contract'

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (gameId: string, difficulty: LeaderboardDifficulty, limit = 20) =>
    ['leaderboard', gameId, difficulty, limit] as const,
}

export const useLeaderboardQuery = (options: {
  gameId: Accessor<string>
  difficulty: Accessor<LeaderboardDifficulty>
  limit?: Accessor<number | undefined>
}) =>
  useQuery(() => {
    const gameId = options.gameId()
    const difficulty = options.difficulty()
    const limit = options.limit?.() ?? 20

    return {
      queryKey: leaderboardKeys.list(gameId, difficulty, limit),
      queryFn: () =>
        unwrap(
          api.leaderboard.get({
            $query: {
              gameId,
              difficulty,
              limit,
            },
          }),
        ),
    }
  })
