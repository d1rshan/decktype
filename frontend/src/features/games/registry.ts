import fallingWordsGame from '@/features/games/falling-words'
import type { GameModule } from '@/features/games/types'

export const gameRegistry: GameModule[] = [
  fallingWordsGame,
]
