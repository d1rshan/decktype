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
      <div class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
        recent results
      </div>

      <Switch>
        <Match when={resultsQuery.isPending}>
          <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--sub)]">
            loading results...
          </div>
        </Match>

        <Match when={resultsQuery.error}>
          <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--error)]">
            {getErrorMessage(resultsQuery.error, 'Unable to load results.')}
          </div>
        </Match>

        <Match when={resultsQuery.data?.length}>
          <div class="overflow-hidden rounded-xl bg-[var(--sub-alt)]/35 ring-1 ring-[var(--sub)]/12">
            <div class="hidden border-b border-[var(--sub)]/20 px-4 py-3.5 text-sm text-[var(--sub)] sm:grid sm:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] sm:items-center">
              <div>game</div>
              <div>score</div>
              <div>difficulty</div>
              <div>date</div>
            </div>

            <For each={resultsQuery.data}>
              {(result) => (
                <div class="grid gap-2 border-b border-[var(--sub)]/10 px-4 py-3.5 text-sm last:border-b-0 sm:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] sm:items-center">
                  <div class="text-[var(--text)]">{result.gameId}</div>
                  <div class="font-semibold text-[var(--text)]">{result.score}</div>
                  <div class="text-[var(--sub)]">{result.difficulty}</div>
                  <div class="text-[var(--sub)]">{formatPlayedAt(result.createdAt)}</div>
                </div>
              )}
            </For>
          </div>
        </Match>

        <Match when>
          <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--sub)]">
            no results yet
          </div>
        </Match>
      </Switch>
    </div>
  )
}

export default ResultHistory
