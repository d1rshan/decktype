import { For } from 'solid-js'
import { gameRegistry } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'
import { GameCard } from './game-card'

type GameSelectorProps = {
  activeGameId?: GameId | null
  onSelectGame: (gameId: GameId) => void
}

function GameSelector(props: GameSelectorProps) {
  return (
    <div class="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <For each={gameRegistry}>
        {(game) => (
          <GameCard
            id={game.id}
            name={game.name}
            description={game.description}
            onClick={() => props.onSelectGame(game.id)}
          />
        )}
      </For>
    </div>
  )
}

export default GameSelector
