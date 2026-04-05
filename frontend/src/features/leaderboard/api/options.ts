import { api, request } from '@/lib/api-client'

import type { LeaderboardDifficulty } from './contract'

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (gameId: string, difficulty: LeaderboardDifficulty, limit = 20) =>
    ['leaderboard', gameId, difficulty, limit] as const,
}

export const leaderboardQueryOptions = (
  gameId: string,
  difficulty: LeaderboardDifficulty,
  limit = 20,
) => ({
  queryKey: leaderboardKeys.list(gameId, difficulty, limit),
  queryFn: () =>
    request(
      api.leaderboard.get({
        $query: {
          gameId,
          ...(difficulty === 'all' ? {} : { difficulty }),
          limit,
        },
      }),
    ),
})
