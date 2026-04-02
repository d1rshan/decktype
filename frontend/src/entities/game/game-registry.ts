import fallingWordsGame from '../../content/games/falling-words'
import quoteRaceGame from '../../content/games/quote-race'
import timeAttackGame from '../../content/games/time-attack'
import type { GameDefinition } from './types'

export const gameRegistry: GameDefinition[] = [
  fallingWordsGame,
  quoteRaceGame,
  timeAttackGame,
]
