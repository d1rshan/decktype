import fallingWordsGame from '@/features/games/falling-words'
import type { GameId, GameModule } from '@/features/games/types'

export const games: Record<GameId, GameModule> = {
  'falling-words': fallingWordsGame,
}

export const gameRegistry = Object.values(games)
