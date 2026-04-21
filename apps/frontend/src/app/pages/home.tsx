import { createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import GameSelector from '@/features/games/components/game-selector'
import { FeedbackFeed } from '@/features/feedback/components/feedback-feed'
import { games } from '@/features/games/registry'
import type { GameId } from '@/features/games/types'
import type { WordBankId } from '@/features/content/word-banks/types'

type HomeProps = {
  selectedGameId: GameId | null
  selectedWordBankId: WordBankId | null
  onSelectGame: (gameId: GameId) => void
}

function HomePage(props: HomeProps) {
  const selectedGame = createMemo(() => (
    props.selectedGameId ? games[props.selectedGameId] ?? null : null
  ))
  const selectedGameView = createMemo(() => selectedGame()?.View ?? null)

  return (
    <div class="flex flex-1 flex-col gap-12">
      {!props.selectedGameId && (
        <>
          <GameSelector
            activeGameId={props.selectedGameId}
            onSelectGame={props.onSelectGame}
          />
          <FeedbackFeed />
        </>
      )}

      {props.selectedGameId && selectedGameView() && (
        <Dynamic component={selectedGameView()!} wordBankId={props.selectedWordBankId} />
      )}
    </div>
  )
}

export default HomePage
