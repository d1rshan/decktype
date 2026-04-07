import { Table, type TableColumn } from '@/components/table'
import { Match, Switch } from 'solid-js'

import { useMyResultsQuery } from '@/features/results/api/hooks'
import { getGameName } from '@/features/games/utils'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { formatDateTime } from '@/lib/utils'
import { Text } from '@/components/ui/text'

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
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
            aria-label="Loading results"
            role="status"
          />
        </div>
      </Match>

      <Match when={resultsQuery.error}>
        <div class="rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
          <Text variant="body">{getErrorMessage(resultsQuery.error, 'Unable to load results.')}</Text>
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
          <Text variant="body">no results yet</Text>
        </div>
      </Match>
    </Switch>
  )
}

export default ResultsTable
