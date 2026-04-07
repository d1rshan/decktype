import { For, createSignal } from 'solid-js'

import type { LeaderboardDifficulty } from '@/features/leaderboard/api/contract'
import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { gameRegistry } from '@/features/games/registry'
import { getGameName } from '@/features/games/utils'
import type { GameId } from '@/features/games/types'
import { Text } from '@/components/ui/text'

const difficulties: LeaderboardDifficulty[] = ['easy', 'medium', 'hard']

function LeaderboardPage() {
  const [gameId, setGameId] = createSignal<GameId>(
    gameRegistry[0].id,
  )

  const [difficulty, setDifficulty] = createSignal<LeaderboardDifficulty>('easy')

  return (
    <div class="w-full min-h-[72vh]">
      <div class="grid items-start gap-7 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside class="space-y-4">
          <div class="rounded-2xl bg-(--sub-alt) p-3">
            <div class="px-1 pb-2">
              <Text variant="label" tone='sub' upper>game</Text>
            </div>
            <div class="space-y-1.5">
              <For each={gameRegistry}>
                {(game) => (
                  <button
                    type="button"
                    class={`block w-full rounded-md px-3 py-2 text-left text-[0.875rem] leading-[1.4] transition ${gameId() === game.id
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

          <div class="rounded-2xl bg-(--sub-alt) p-3">
            <div class="px-1 pb-2">
              <Text variant="label" tone='sub' upper>difficulty</Text>
            </div>
            <div class="space-y-1.5">
              <For each={difficulties}>
                {(level) => (
                  <button
                    type="button"
                    class={`block w-full rounded-md px-3 py-2 text-left text-[0.875rem] leading-[1.4] tracking-[0.05em] transition ${difficulty() === level
                      ? 'bg-(--main)/20 text-(--main)'
                      : 'text-(--text)/90 hover:bg-(--sub)/20'
                      }`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                )}
              </For>
            </div>
          </div>
        </aside>

        <section class="min-w-0">
          <div class="mb-5 border-b border-(--sub)/25 pb-5">
            <div class="capitalize">
              <Text variant="title">{getGameName(gameId())} {difficulty()} leaderboard</Text>
            </div>
          </div>

          <LeaderboardTable gameId={gameId} difficulty={difficulty} />
        </section>
      </div>
    </div>
  )
}

export default LeaderboardPage
