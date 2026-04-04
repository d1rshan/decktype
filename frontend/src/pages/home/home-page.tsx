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
      {!props.selectedGameId && (
        <GameSelector
          activeGameId={props.selectedGameId}
          onSelectGame={props.onSelectGame}
        />
      )}

      {props.selectedGameId && (selectedGameView()
        ? <Dynamic component={selectedGameView()!} />
        : <UnknownGameState />)}
    </div>
  )
}

export default HomePage
