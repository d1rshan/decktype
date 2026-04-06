import { gameRegistry } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'

type GameSelectorProps = {
  activeGameId?: GameId | null
  onSelectGame: (gameId: GameId) => void
}

function GameSelector(props: GameSelectorProps) {
  return (
    <div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {gameRegistry.map((game) => {
        const isActive = props.activeGameId === game.id

        return (
          <button
            type="button"
            class={`group relative flex flex-col items-start gap-6 rounded-3xl p-10 text-left transition-all ${
              isActive
                ? 'bg-(--sub-alt)/40 ring-1 ring-(--main)/30'
                : 'bg-(--sub-alt)/20 hover:bg-(--sub-alt)/40'
            } hover:-translate-y-1`}
            onClick={() => props.onSelectGame(game.id)}
          >
            <div class="flex flex-col gap-3">
              <h2 class="t-title font-bold tracking-tight text-(--text) group-hover:text-(--main) transition-colors">
                {game.name.toLowerCase()}
              </h2>
              <p class="t-body leading-relaxed text-(--sub) opacity-80">
                {game.description.toLowerCase()}
              </p>
            </div>

            <div class="absolute bottom-10 right-10 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-(--main)"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default GameSelector
