import { useQuery } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import {
  leaderboardQueryOptions,
} from './options'
import type { LeaderboardDifficulty } from './contract'

export const useLeaderboardQuery = (options: {
  gameId: Accessor<string>
  difficulty: Accessor<LeaderboardDifficulty>
  limit?: Accessor<number | undefined>
}) =>
  useQuery(() => {
    const limit = options.limit?.() ?? 20

    return leaderboardQueryOptions(
      options.gameId(),
      options.difficulty(),
      limit,
    )
  })
