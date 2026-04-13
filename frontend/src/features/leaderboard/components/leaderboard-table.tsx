import { Table, type TableColumn } from '@/components/table'
import type { Accessor } from 'solid-js'
import { Match, Switch } from 'solid-js'

import { useLeaderboardQuery } from '@/features/leaderboard/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { formatDateTime } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import type { LeaderboardDifficulty, LeaderboardEntry } from '../api/contract'

const columns: TableColumn<LeaderboardEntry>[] = [
  {
    id: 'rank',
    label: '#',
    value: (entry) => entry.rank,
  },
  {
    id: 'player',
    label: 'player',
    value: (entry) => entry.displayName,
  },
  {
    id: 'score',
    label: 'score',
    value: (entry) => entry.bestScore,
  },
  {
    id: 'difficulty',
    label: 'difficulty',
    value: (entry) => entry.difficulty,
  },
  {
    id: 'date',
    label: 'date',
    value: (entry) => formatDateTime(entry.bestResultAt),
  },
]

type LeaderboardTableProps = {
  gameId: Accessor<string>
  difficulty: Accessor<LeaderboardDifficulty>
}

export function LeaderboardTable(props: LeaderboardTableProps) {
  const leaderboardQuery = useLeaderboardQuery({
    gameId: props.gameId,
    difficulty: props.difficulty,
    limit: () => 25,
  })

  return (
    <Switch>
      <Match when={leaderboardQuery.isPending}>
        <div class="flex min-h-32 items-center justify-center px-4 py-4">
          <LoadingSpinner />
        </div>
      </Match>

      <Match when={leaderboardQuery.error}>
        <div class="rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
          <p class="text-base leading-normal">{getErrorMessage(leaderboardQuery.error, 'Unable to load leaderboard.')}</p>
        </div>
      </Match>

      <Match when={leaderboardQuery.data && leaderboardQuery.data.length > 0}>
        <Table
          columns={columns}
          rows={leaderboardQuery.data ?? []}
        />
      </Match>

      <Match when>
        <div class="rounded-lg bg-(--sub-alt) px-4 py-4">
          <p class="text-base leading-normal">no scores yet</p>
        </div>
      </Match>
    </Switch>
  )
}
