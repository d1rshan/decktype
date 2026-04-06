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
          <div class="rounded-xl bg-(--sub-alt)/55 p-3">
            <div class="t-label px-1 pb-2 font-semibold uppercase tracking-[0.16em] text-(--sub)">
              game
            </div>
            <div class="space-y-1.5">
              <For each={gameRegistry}>
                {(game) => (
                  <button
                    type="button"
                    class={`t-body block w-full rounded-md px-3 py-2 text-left transition ${
                      gameId() === game.id
                        ? 'bg-(--main)/20 text-(--main)'
                        : 'text-(--text)/90 hover:bg-(--sub)/20'
                    }`}
                    onClick={() => setGameId(game.id)}
                  >
                    {game.name.toLowerCase()}
                  </button>
                )}
              </For>
            </div>
          </div>

          <div class="rounded-xl bg-(--sub-alt)/55 p-3">
            <div class="t-label px-1 pb-2 font-semibold uppercase tracking-[0.16em] text-(--sub)">
              difficulty
            </div>
            <div class="space-y-1.5">
              <For each={difficultyFilters}>
                {(option) => (
                    <button
                      type="button"
                      class={`t-label-strong block w-full rounded-md px-3 py-2 text-left font-semibold uppercase tracking-[0.05em] transition ${
                        difficulty() === option.value
                          ? 'bg-(--main)/20 text-(--main)'
                          : 'text-(--text)/90 hover:bg-(--sub)/20'
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
          <div class="mb-5 border-b border-(--sub)/25 pb-5">
            <h1 class="t-page-title leading-tight text-(--text)">
              {selectedGameName()} {toTitleCase(difficulty())} Leaderboard
            </h1>
          </div>

          {leaderboardQuery.isPending && (
            <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
              loading leaderboard...
            </div>
          )}

          {leaderboardQuery.error && (
            <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--error)">
              {getErrorMessage(leaderboardQuery.error, 'Unable to load leaderboard.')}
            </div>
          )}

          {leaderboardQuery.data && leaderboardQuery.data.length > 0 && (
            <div class="overflow-hidden rounded-xl bg-(--sub-alt)/35 ring-1 ring-(--sub)/12">
              <div class="t-body hidden border-b border-(--sub)/20 px-4 py-3.5 text-(--sub) sm:grid sm:grid-cols-[0.45fr_1.5fr_0.85fr_0.85fr_1fr] sm:items-center">
                <div>#</div>
                <div>player</div>
                <div>score</div>
                <div>difficulty</div>
                <div>date</div>
              </div>

              <For each={leaderboardQuery.data}>
                {(entry) => (
                  <div class="t-body grid gap-2 border-b border-(--sub)/10 px-4 py-3.5 last:border-b-0 sm:grid-cols-[0.45fr_1.5fr_0.85fr_0.85fr_1fr] sm:items-center">
                    <div class="font-semibold text-(--main)">{entry.rank}</div>
                    <div>
                      <div class="truncate text-(--text)">{entry.displayName}</div>
                    </div>
                    <div class="font-semibold text-(--text)">{entry.bestScore}</div>
                    <div class="text-(--sub)">{entry.difficulty}</div>
                    <div class="text-(--sub)">{formatBestResultAt(entry.bestResultAt)}</div>
                  </div>
                )}
              </For>
            </div>
          )}

          {leaderboardQuery.data && leaderboardQuery.data.length === 0 && (
            <div class="t-body rounded-lg bg-(--sub-alt) px-4 py-4 text-(--sub)">
              no scores yet
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default LeaderboardPage
