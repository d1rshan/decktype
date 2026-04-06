import { For, Match, Switch } from 'solid-js'

import { useMyResultsQuery } from '@/features/results/api/hooks'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'

function formatPlayedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function ResultHistory() {
  const session = authClient.useSession()
  const resultsQuery = useMyResultsQuery({
    enabled: () => Boolean(session().data?.user),
    limit: () => 12,
  })

  return (
    <div class="space-y-4">
      <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
        recent results
      </div>

      <Switch>
        <Match when={resultsQuery.isPending}>
          <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
            loading results...
          </div>
        </Match>

        <Match when={resultsQuery.error}>
          <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
            {getErrorMessage(resultsQuery.error, 'Unable to load results.')}
          </div>
        </Match>

        <Match when={resultsQuery.data?.length}>
          <div class="overflow-hidden rounded-xl bg-(--sub-alt)/35 ring-1 ring-(--sub)/12">
            <div class="t-body hidden border-b border-(--sub)/20 px-4 py-3.5 text-(--sub) sm:grid sm:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] sm:items-center">
              <div>game</div>
              <div>score</div>
              <div>difficulty</div>
              <div>date</div>
            </div>

            <For each={resultsQuery.data}>
              {(result) => (
                <div class="t-body grid gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0 sm:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] sm:items-center">
                  <div class="text-(--text)">{result.gameId}</div>
                  <div class="font-semibold text-(--text)">{result.score}</div>
                  <div class="text-(--sub)">{result.difficulty}</div>
                  <div class="text-(--sub)">{formatPlayedAt(result.createdAt)}</div>
                </div>
              )}
            </For>
          </div>
        </Match>

        <Match when>
          <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
            no results yet
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default ResultHistory
