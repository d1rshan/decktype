import { Table, type TableColumn } from '@/components/table'
import type { Accessor } from 'solid-js'
import { Match, Switch } from 'solid-js'

import { useLeaderboardQuery } from '@/features/leaderboard/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { formatDateTime } from '@/lib/utils'
import { Text } from '@/components/ui/text'

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
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
            aria-label="Loading leaderboard"
            role="status"
          />
        </div>
      </Match>

      <Match when={leaderboardQuery.error}>
        <div class="rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
          <Text variant="body">{getErrorMessage(leaderboardQuery.error, 'Unable to load leaderboard.')}</Text>
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
          <Text variant="body">no scores yet</Text>
        </div>
      </Match>
    </Switch>
  )
}
