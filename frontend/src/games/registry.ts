import fallingWordsGame from './falling-words'
import quoteRaceGame from './quote-race'
import timeAttackGame from './time-attack'
import type { GameModule } from './types'

export const gameRegistry: GameModule[] = [
  fallingWordsGame,
  quoteRaceGame,
  timeAttackGame,
]
