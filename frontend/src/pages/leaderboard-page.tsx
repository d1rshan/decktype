import { For, createSignal } from 'solid-js'

import { useLeaderboardQuery } from '@/features/leaderboard/api/hooks'
import type { LeaderboardDifficulty } from '@/features/leaderboard/api/contract'
import { getErrorMessage } from '@/lib/api-client'

const difficultyFilters: {
  value: LeaderboardDifficulty
  label: string
}[] = [
  { value: 'all', label: 'all' },
  { value: 'easy', label: 'easy' },
  { value: 'medium', label: 'medium' },
  { value: 'hard', label: 'hard' },
]

function formatBestResultAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function LeaderboardPage() {
  const [difficulty, setDifficulty] = createSignal<LeaderboardDifficulty>('all')
  const leaderboardQuery = useLeaderboardQuery({
    gameId: () => 'falling-words',
    difficulty,
    limit: () => 25,
  })

  return (
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="text-xs uppercase tracking-[0.14em] text-[var(--sub)]">leaderboard</div>
          <div class="mt-1 text-2xl font-bold text-[var(--text)]">falling words</div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <For each={difficultyFilters}>
            {(option) => (
              <button
                type="button"
                class={`rounded-md border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition ${
                  difficulty() === option.value
                    ? 'border-[var(--main)] text-[var(--main)]'
                    : 'border-[var(--sub)]/40 text-[var(--sub)] hover:text-[var(--text)]'
                }`}
                onClick={() => setDifficulty(option.value)}
              >
                {option.label}
              </button>
            )}
          </For>
        </div>
      </div>

      {leaderboardQuery.isPending && (
        <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--sub)]">
          loading leaderboard...
        </div>
      )}

      {leaderboardQuery.error && (
        <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--error)]">
          {getErrorMessage(leaderboardQuery.error, 'Unable to load leaderboard.')}
        </div>
      )}

      {leaderboardQuery.data && leaderboardQuery.data.length > 0 && (
        <div class="overflow-hidden rounded-lg bg-[var(--sub-alt)]">
          <For each={leaderboardQuery.data}>
            {(entry) => (
              <div class="grid gap-2 border-b border-[var(--bg)]/50 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[0.4fr_1.2fr_0.8fr_0.8fr_1fr] sm:items-center">
                <div class="font-semibold text-[var(--main)]">#{entry.rank}</div>
                <div>
                  <div class="text-[var(--text)]">{entry.displayName}</div>
                  <div class="mt-0.5 text-xs uppercase tracking-[0.12em] text-[var(--sub)]">
                    {entry.userId}
                  </div>
                </div>
                <div class="text-[var(--text)]">score {entry.bestScore}</div>
                <div class="text-[var(--sub)]">{entry.difficulty}</div>
                <div class="text-[var(--sub)]">{formatBestResultAt(entry.bestResultAt)}</div>
              </div>
            )}
          </For>
        </div>
      )}

      {leaderboardQuery.data && leaderboardQuery.data.length === 0 && (
        <div class="rounded-lg bg-[var(--sub-alt)] px-4 py-4 text-sm text-[var(--sub)]">
          no scores yet
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage
