import { For, createMemo, createSignal } from 'solid-js'

import type { LeaderboardDifficulty } from '@/features/leaderboard/api/contract'
import { useLeaderboardQuery } from '@/features/leaderboard/api/hooks'
import { gameRegistry } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'
import { getErrorMessage } from '@/lib/api-client'

const difficultyFilters: {
  value: LeaderboardDifficulty
  label: string
}[] = [
  { value: 'easy', label: 'EASY' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'hard', label: 'HARD' },
]

function toTitleCase(value: string) {
  if (!value) {
    return value
  }

  return `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`
}

function formatBestResultAt(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function LeaderboardPage() {
  const [gameId, setGameId] = createSignal<GameId>(
    gameRegistry[0]?.id ?? 'falling-words',
  )
  const [difficulty, setDifficulty] = createSignal<LeaderboardDifficulty>('easy')

  const selectedGameName = createMemo(
    () => gameRegistry.find((game) => game.id === gameId())?.name ?? 'Leaderboard',
  )

  const leaderboardQuery = useLeaderboardQuery({
    gameId,
    difficulty,
    limit: () => 25,
  })

  return (
    <div class="w-full min-h-[72vh]">
      <div class="grid items-start gap-7 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside class="space-y-4">
          <div class="rounded-xl bg-[var(--sub-alt)]/55 p-3">
            <div class="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
              game
            </div>
            <div class="space-y-1.5">
              <For each={gameRegistry}>
                {(game) => (
                  <button
                    type="button"
                    class={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      gameId() === game.id
                        ? 'bg-[var(--main)]/20 text-[var(--main)]'
                        : 'text-[var(--text)]/90 hover:bg-[var(--sub)]/20'
                    }`}
                    onClick={() => setGameId(game.id)}
                  >
                    {game.name.toLowerCase()}
                  </button>
                )}
              </For>
            </div>
          </div>

          <div class="rounded-xl bg-[var(--sub-alt)]/55 p-3">
            <div class="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">
              difficulty
            </div>
            <div class="space-y-1.5">
              <For each={difficultyFilters}>
                {(option) => (
                  <button
                    type="button"
                    class={`block w-full rounded-md px-3 py-2 text-left text-xs font-semibold tracking-[0.08em] transition ${
                      difficulty() === option.value
                        ? 'bg-[var(--main)]/20 text-[var(--main)]'
                        : 'text-[var(--text)]/90 hover:bg-[var(--sub)]/20'
                    }`}
                    onClick={() => setDifficulty(option.value)}
                  >
                    {option.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        </aside>

        <section class="min-w-0">
          <div class="mb-5 border-b border-[var(--sub)]/25 pb-5">
            <h1 class="text-[2rem] leading-tight text-[var(--text)]">
              {selectedGameName()} {toTitleCase(difficulty())} Leaderboard
            </h1>
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
            <div class="overflow-hidden rounded-xl bg-[var(--sub-alt)]/35 ring-1 ring-[var(--sub)]/12">
              <div class="hidden border-b border-[var(--sub)]/20 px-4 py-3.5 text-sm text-[var(--sub)] sm:grid sm:grid-cols-[0.45fr_1.5fr_0.85fr_0.85fr_1fr] sm:items-center">
                <div>#</div>
                <div>player</div>
                <div>score</div>
                <div>difficulty</div>
                <div>date</div>
              </div>

              <For each={leaderboardQuery.data}>
                {(entry) => (
                  <div class="grid gap-2 border-b border-[var(--sub)]/10 px-4 py-3.5 text-sm last:border-b-0 sm:grid-cols-[0.45fr_1.5fr_0.85fr_0.85fr_1fr] sm:items-center">
                    <div class="font-semibold text-[var(--main)]">{entry.rank}</div>
                    <div>
                      <div class="truncate text-[var(--text)]">{entry.displayName}</div>
                    </div>
                    <div class="font-semibold text-[var(--text)]">{entry.bestScore}</div>
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
        </section>
      </div>
    </div>
  )
}

export default LeaderboardPage
