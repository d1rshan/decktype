import { createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import GameSelector from '../../features/game-selector/game-selector'
import { getGameById } from '../../games/get-game-by-id'
import type { GameId } from '../../games/types'

type HomePageProps = {
  selectedGameId: GameId | null
  onSelectGame: (gameId: GameId) => void
  onClearSelection: () => void
}

function UnknownGameState() {
  return (
    <div class="rounded-[2rem] border border-white/10 bg-white/6 p-8 text-white/70 backdrop-blur-xl">
      Unknown game.
    </div>
  )
}

function HomePage(props: HomePageProps) {
  const selectedGame = createMemo(() => getGameById(props.selectedGameId))
  const selectedGameView = createMemo(() => selectedGame()?.View ?? null)

  return (
    <div class="flex flex-1 flex-col gap-12">
      <div class="flex items-center justify-between gap-6">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--sub)]">
            games
          </p>
          <h1 class="mt-3 text-4xl font-bold tracking-tight text-[var(--text)]">
            pick a mode and type
          </h1>
        </div>

        {props.selectedGameId && (
          <button
            type="button"
            class="rounded-xl bg-[var(--sub-alt)] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--sub)] transition hover:text-[var(--text)]"
            onClick={props.onClearSelection}
          >
            back to game list
          </button>
        )}
      </div>

      <GameSelector
        activeGameId={props.selectedGameId}
        onSelectGame={props.onSelectGame}
      />

      {props.selectedGameId && (selectedGameView()
        ? <Dynamic component={selectedGameView()!} />
        : <UnknownGameState />)}
    </div>
  )
}

export default HomePage
