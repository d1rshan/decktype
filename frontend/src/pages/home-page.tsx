import { createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import GameSelector from '@/features/games/components/game-selector'
import { getGameById } from '@/features/games/get-game-by-id'
import type { GameId } from '@/features/games/types'
import type { WordBankId } from '@/features/content/word-banks/types'

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
