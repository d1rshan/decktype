import type { GameModule } from '../types'
import QuoteRaceView from './view'

export const quoteRaceGameMeta: GameModule = {
  id: 'quote-race',
  name: 'Quote Race',
  description: 'Long-form passages, higher accuracy pressure, calmer pacing.',
  status: 'coming-soon',
  defaultWordBankId: 'english/core-1k',
  View: QuoteRaceView,
}
