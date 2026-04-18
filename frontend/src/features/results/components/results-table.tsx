import { Table, type TableColumn } from '@/components/table'
import { useMyResultsQuery } from '@/features/results/api'
import { getGameName } from '@/features/games/utils'
import { authClient } from '@/lib/auth-client'
import { formatDateTime } from '@/lib/utils'
import { QueryState } from '@/components/ui/query-state'

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
    <QueryState
      query={resultsQuery}
      emptyMessage="no results yet"
    >
      {(results) => (
        <Table
          columns={columns}
          rows={results}
        />
      )}
    </QueryState>
  )
}

export default ResultsTable
