import { createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import GameSelector from '@/components/game-selector'
import { getGameById } from '@/games/get-game-by-id'
import type { GameId } from '@/games/types'
import type { WordBankId } from '@/word-banks/types'

type HomePageProps = {
  selectedGameId: GameId | null
  selectedWordBankId: WordBankId | null
  onSelectGame: (gameId: GameId) => void
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

      {props.selectedGameId && selectedGameView() && (
        <Dynamic component={selectedGameView()!} wordBankId={props.selectedWordBankId} />
      )}
    </div>
  )
}

export default HomePage
