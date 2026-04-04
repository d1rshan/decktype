import type { GameModule } from '../types'
import FallingWordsView from './view'

export const fallingWordsGameMeta: GameModule = {
  id: 'falling-words',
  name: 'Falling Words',
  description: 'Catch words before they hit the bottom of the screen.',
  status: 'live',
  defaultWordBankId: 'english/core-1k',
  View: FallingWordsView,
}
