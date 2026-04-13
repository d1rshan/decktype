import { Table, type TableColumn } from '@/components/table'
import { Match, Switch } from 'solid-js'

import { useMyResultsQuery } from '@/features/results/api/hooks'
import { getGameName } from '@/features/games/utils'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { formatDateTime } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

type ResultsTableRow = NonNullable<ReturnType<typeof useMyResultsQuery>['data']>[number]

const columns: TableColumn<ResultsTableRow>[] = [
  {
    id: 'game',
    label: 'game',
    value: (result) => getGameName(result.gameId),
  },
  {
    id: 'score',
    label: 'score',
    value: (result) => result.score,
  },
  {
    id: 'difficulty',
    label: 'difficulty',
    value: (result) => result.difficulty,
  },
  {
    id: 'date',
    label: 'date',
    value: (result) => formatDateTime(result.createdAt),
  },
]

function ResultsTable() {
  const session = authClient.useSession()
  const resultsQuery = useMyResultsQuery({
    enabled: () => Boolean(session().data?.user),
    limit: () => 12,
  })

  return (
    <Switch>
      <Match when={resultsQuery.isPending}>
        <div class="flex min-h-32 items-center justify-center px-4 py-4">
          <LoadingSpinner />
        </div>
      </Match>

      <Match when={resultsQuery.error}>
        <div class="rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
          <p class="text-base leading-normal">{getErrorMessage(resultsQuery.error, 'Unable to load results.')}</p>
        </div>
      </Match>

      <Match when={resultsQuery.data && resultsQuery.data.length > 0}>
        <Table
          columns={columns}
          rows={resultsQuery.data ?? []}
        />
      </Match>

      <Match when>
        <div class="rounded-lg bg-(--sub-alt) px-4 py-4">
          <p class="text-base leading-normal">no results yet</p>
        </div>
      </Match>
    </Switch>
  )
}

export default ResultsTable
