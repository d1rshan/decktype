import fallingWordsGame from '@/games/falling-words'
import type { GameModule } from '@/games/types'

export const gameRegistry: GameModule[] = [
  fallingWordsGame,
]
